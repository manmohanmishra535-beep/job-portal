import { Webhook } from 'svix';
import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

export class AuthService {
  /**
   * Process Clerk Webhooks with Svix signature verification
   */
  static async handleWebhook(headers: Record<string, string>, payload: any) {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    let event: any = payload;

    if (webhookSecret) {
      const svixId = headers['svix-id'];
      const svixTimestamp = headers['svix-timestamp'];
      const svixSignature = headers['svix-signature'];

      if (!svixId || !svixTimestamp || !svixSignature) {
        throw new AppError('Missing svix webhook verification headers', 400);
      }

      const wh = new Webhook(webhookSecret);
      try {
        event = wh.verify(JSON.stringify(payload), {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        });
      } catch (err) {
        throw new AppError('Invalid webhook signature', 400, [(err as Error).message]);
      }
    } else {
      console.warn('[Clerk Webhook] CLERK_WEBHOOK_SECRET not configured. Skipping signature verification in dev.');
    }

    const { type, data } = event;

    switch (type) {
      case 'user.created': {
        const clerkId = data.id;
        const email = data.email_addresses?.[0]?.email_address;
        const name = `${data.first_name || ''} ${data.last_name || ''}`.trim() || null;

        if (!email) {
          throw new AppError('Webhook event missing user email address', 400);
        }

        // Determine initial role from public_metadata or default to USER
        const role = (data.public_metadata?.role as Role) || Role.USER;

        const user = await prisma.user.upsert({
          where: { clerkId },
          update: { email, name, role },
          create: {
            clerkId,
            email,
            name,
            role,
          },
        });

        // Initialize empty profile
        await prisma.profile.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id },
        });

        return { action: 'user_created', userId: user.id };
      }

      case 'user.updated': {
        const clerkId = data.id;
        const email = data.email_addresses?.[0]?.email_address;
        const name = `${data.first_name || ''} ${data.last_name || ''}`.trim() || undefined;

        await prisma.user.updateMany({
          where: { clerkId },
          data: {
            ...(email ? { email } : {}),
            ...(name ? { name } : {}),
          },
        });

        return { action: 'user_updated', clerkId };
      }

      case 'user.deleted': {
        const clerkId = data.id;
        await prisma.user.deleteMany({
          where: { clerkId },
        });
        return { action: 'user_deleted', clerkId };
      }

      default:
        return { action: 'ignored', type };
    }
  }
}

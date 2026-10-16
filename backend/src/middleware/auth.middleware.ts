import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Middleware that verifies Clerk session token from the Authorization header
 * and attaches the synchronized database User to req.user.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No bearer token provided.',
        errors: [],
      });
    }

    const token = authHeader.split(' ')[1];
    const secretKey = process.env.CLERK_SECRET_KEY;

    let clerkUserId: string | null = null;

    if (secretKey) {
      try {
        const verified = await verifyToken(token, { secretKey });
        clerkUserId = verified.sub;
      } catch (tokenErr) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired session token.',
          errors: [(tokenErr as Error).message],
        });
      }
    } else {
      // Development mock fallback if secretKey is not set yet
      console.warn('[Auth] CLERK_SECRET_KEY not set. Using token as clerkId mock.');
      clerkUserId = token;
    }

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.',
        errors: [],
      });
    }

    // Lookup user in PostgreSQL database
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found in database. Please sync via webhook or sign-in.',
        errors: [],
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error('[Auth Middleware] Exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication processing failed.',
      errors: [(error as Error).message],
    });
  }
}

/**
 * Middleware for checking Role-Based Access Control (RBAC)
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        errors: [],
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(', ')}] role(s).`,
        errors: [],
      });
    }

    return next();
  };
}

/**
 * Optional authentication: loads user if token present, but doesn't block if absent
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (secretKey) {
      const verified = await verifyToken(token, { secretKey });
      if (verified && verified.sub) {
        const user = await prisma.user.findUnique({
          where: { clerkId: verified.sub },
          select: { id: true, clerkId: true, email: true, name: true, role: true },
        });
        if (user) req.user = user;
      }
    }
  } catch {
    // Silently continue for optional auth
  }
  return next();
}

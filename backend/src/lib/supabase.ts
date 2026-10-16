import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const STORAGE_BUCKETS = {
  RESUMES: 'resumes',
  AVATARS: 'avatars',
  COMPANY_LOGOS: 'company-logos',
} as const;

/**
 * Generates a signed download URL for private files (e.g. resumes)
 */
export async function getSignedUrl(
  bucket: string,
  filePath: string,
  expiresInSeconds = 3600
): Promise<string | null> {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error || !data) {
      console.error('[Supabase Storage] Error creating signed URL:', error);
      return null;
    }
    return data.signedUrl;
  } catch (err) {
    console.error('[Supabase Storage] Exception creating signed URL:', err);
    return null;
  }
}

/**
 * Gets a public URL for public bucket assets (e.g. logos, avatars)
 */
export function getPublicUrl(bucket: string, filePath: string): string {
  if (!supabaseUrl) return '';
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

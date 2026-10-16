/**
 * Development-only stand-in for `@clerk/nextjs/server`.
 *
 * Aliased in by `next.config.js` only when AUTH_SHIM=true. It lets `/dashboard`,
 * `/recruiter` and `/admin` be reached locally without Clerk credentials by
 * treating the request as an authenticated development user.
 *
 * NEVER enable this outside local development.
 */

import { NextResponse, type NextRequest } from 'next/server';

/** Seeded candidate from `backend/prisma/seed.ts`. */
export const DEV_DEFAULT_USER = 'user_candidate_mock_789';

interface AuthObject {
  userId: string | null;
  sessionId: string | null;
  protect: () => void;
  has: () => boolean;
  redirectToSignIn: () => never;
}

type ClerkMiddlewareHandler = (
  auth: () => AuthObject,
  req: NextRequest
) => unknown;

/** Translates Clerk's `(.*)` route globs into regular expressions. */
function toRegExp(pattern: string): RegExp {
  const WILDCARD = '\u0000';
  const withPlaceholder = pattern.split('(.*)').join(WILDCARD);
  const escaped = withPlaceholder.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.split(WILDCARD).join('.*')}$`);
}

export function createRouteMatcher(patterns: string[]) {
  const regexes = patterns.map(toRegExp);
  return (req: NextRequest) => regexes.some((re) => re.test(req.nextUrl.pathname));
}

/**
 * Mirrors Clerk's middleware signature. `auth().protect()` is deliberately a
 * no-op so protected pages render during local development.
 */
export function clerkMiddleware(handler?: ClerkMiddlewareHandler) {
  return async (req: NextRequest) => {
    if (typeof handler === 'function') {
      const auth = (): AuthObject => ({
        userId: DEV_DEFAULT_USER,
        sessionId: `dev_session_${DEV_DEFAULT_USER}`,
        protect: () => {},
        has: () => true,
        redirectToSignIn: () => {
          throw new Error('redirectToSignIn is not supported by the development auth shim');
        },
      });

      await handler(auth, req);
    }

    return NextResponse.next();
  };
}

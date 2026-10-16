'use client';

/**
 * Development-only stand-in for `@clerk/nextjs`.
 *
 * This module is NOT used unless the build is explicitly configured with
 * AUTH_SHIM=true (see `next.config.js`), in which case webpack aliases
 * `@clerk/nextjs` to this file. It exists so the UI can be browsed locally
 * without real Clerk credentials.
 *
 * The tokens it produces are the seeded `clerkId` values, which the backend
 * accepts only because `CLERK_SECRET_KEY` is unset (see the development
 * fallback in `backend/src/middleware/auth.middleware.ts`).
 *
 * NEVER enable this outside local development.
 */

import React, {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

export type DevRole = 'USER' | 'RECRUITER' | 'ADMIN';

export interface DevPersona {
  clerkId: string;
  role: DevRole;
  firstName: string;
  fullName: string;
  email: string;
}

/** Mirrors the users created by `backend/prisma/seed.ts`. */
export const DEV_PERSONAS: DevPersona[] = [
  {
    clerkId: 'user_candidate_mock_789',
    role: 'USER',
    firstName: 'Alex',
    fullName: 'Alex Johnson',
    email: 'candidate@example.com',
  },
  {
    clerkId: 'user_recruiter_mock_456',
    role: 'RECRUITER',
    firstName: 'Sarah',
    fullName: 'Sarah Connor',
    email: 'recruiter@google.com',
  },
  {
    clerkId: 'user_admin_mock_123',
    role: 'ADMIN',
    firstName: 'System',
    fullName: 'System Administrator',
    email: 'admin@jobportal.dev',
  },
];

const STORAGE_KEY = 'nexus:devAuth';
const DEFAULT_CLERK_ID =
  process.env.NEXT_PUBLIC_DEV_AUTH_DEFAULT || DEV_PERSONAS[0].clerkId;

let currentClerkId: string | null = DEFAULT_CLERK_ID;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readStoredPersona(): string | null {
  try {
    if (typeof localStorage === 'undefined') return DEFAULT_CLERK_ID;
    const stored = localStorage.getItem(STORAGE_KEY);
    // Absent -> default persona. Empty string -> explicit sign-out.
    if (stored === null) return DEFAULT_CLERK_ID;
    if (stored === '') return null;
    return stored;
  } catch {
    return DEFAULT_CLERK_ID;
  }
}

export function setDevPersona(clerkId: string | null) {
  currentClerkId = clerkId;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, clerkId ?? '');
    }
  } catch {
    /* ignore storage failures */
  }
  emit();
}

function useCurrentClerkId(): string | null {
  const [clerkId, setClerkId] = useState<string | null>(currentClerkId);

  useEffect(() => {
    const stored = readStoredPersona();
    currentClerkId = stored;
    setClerkId(stored);
    return subscribe(() => setClerkId(currentClerkId));
  }, []);

  return clerkId;
}

function toUser(clerkId: string | null) {
  const persona = DEV_PERSONAS.find((p) => p.clerkId === clerkId) ?? null;
  if (!persona) return null;
  return {
    id: persona.clerkId,
    firstName: persona.firstName,
    fullName: persona.fullName,
    primaryEmailAddress: { emailAddress: persona.email },
    imageUrl: '',
  };
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export function ClerkProvider({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

export function useAuth() {
  const clerkId = useCurrentClerkId();
  // Resolve the persona from storage at call time. The persona is otherwise read
  // in an effect, so on a hard reload the first data fetch would otherwise use the
  // default persona and hit role-gated endpoints with the wrong identity (403).
  const getToken = useCallback(async () => readStoredPersona(), []);
  const signOut = useCallback(async () => setDevPersona(null), []);

  return {
    isLoaded: true,
    isSignedIn: Boolean(clerkId),
    userId: clerkId,
    sessionId: clerkId ? `dev_session_${clerkId}` : null,
    getToken,
    signOut,
  };
}

export function useUser() {
  const clerkId = useCurrentClerkId();
  const user = toUser(clerkId);
  return { isLoaded: true, isSignedIn: Boolean(user), user };
}

export function useClerk() {
  return {
    signOut: async () => setDevPersona(null),
    openSignIn: () => setDevPersona(DEFAULT_CLERK_ID),
    openSignUp: () => setDevPersona(DEFAULT_CLERK_ID),
  };
}

/* ------------------------------------------------------------------ */
/* Conditional rendering helpers                                       */
/* ------------------------------------------------------------------ */

type ConditionalChildren = ReactNode | (() => ReactNode);

export function SignedIn({ children }: { children?: ConditionalChildren }) {
  const clerkId = useCurrentClerkId();
  if (!clerkId) return null;
  return <>{typeof children === 'function' ? children() : children}</>;
}

export function SignedOut({ children }: { children?: ConditionalChildren }) {
  const clerkId = useCurrentClerkId();
  if (clerkId) return null;
  return <>{typeof children === 'function' ? children() : children}</>;
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

function withSignIn(children: ReactNode) {
  const handleClick = () => setDevPersona(DEFAULT_CLERK_ID);
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: handleClick,
    });
  }
  return (
    <button type="button" onClick={handleClick}>
      {children}
    </button>
  );
}

export function SignInButton({ children }: { children?: ReactNode; mode?: string }) {
  return <>{withSignIn(children ?? 'Sign In')}</>;
}

export function SignUpButton({ children }: { children?: ReactNode; mode?: string }) {
  return <>{withSignIn(children ?? 'Sign Up')}</>;
}

/* ------------------------------------------------------------------ */
/* UserButton                                                          */
/* ------------------------------------------------------------------ */

const ROLE_LABEL: Record<DevRole, string> = {
  USER: 'Candidate',
  RECRUITER: 'Recruiter',
  ADMIN: 'Admin',
};

export function UserButton(_props: { afterSignOutUrl?: string; appearance?: unknown }) {
  const clerkId = useCurrentClerkId();
  const [open, setOpen] = useState(false);

  if (!clerkId) return null;
  const persona = DEV_PERSONAS.find((p) => p.clerkId === clerkId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Dev auth persona"
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-gray-200 hover:bg-white/10"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-[11px] font-bold text-white">
          {persona?.firstName?.slice(0, 1) ?? '?'}
        </span>
        <span className="hidden lg:inline">{persona ? ROLE_LABEL[persona.role] : 'Dev'}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-white/10 bg-[#0f172a] shadow-2xl">
          <div className="border-b border-white/10 px-3 py-2 text-[10px] uppercase tracking-wider text-gray-500">
            Dev auth shim
          </div>
          {DEV_PERSONAS.map((p) => (
            <button
              key={p.clerkId}
              type="button"
              onClick={() => {
                setDevPersona(p.clerkId);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-xs hover:bg-white/5 ${
                p.clerkId === clerkId ? 'text-indigo-300' : 'text-gray-300'
              }`}
            >
              <span className="font-semibold">{ROLE_LABEL[p.role]}</span>
              <span className="ml-1 text-gray-500">{p.fullName}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setDevPersona(null);
              setOpen(false);
            }}
            className="block w-full border-t border-white/10 px-3 py-2 text-left text-xs text-rose-300 hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sign-in / Sign-up screens                                           */
/* ------------------------------------------------------------------ */

function DevSignInCard({ title, subtitle }: { title: string; subtitle: string }) {
  const router = useRouter();

  const choose = (clerkId: string) => {
    setDevPersona(clerkId);
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f172a]/95 p-8 shadow-2xl">
      <h1 className="font-heading text-2xl font-extrabold text-white">{title}</h1>
      <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
      <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-300">
        Clerk is not configured, so the development auth shim is active. Pick a seeded user to
        continue.
      </p>
      <div className="mt-5 space-y-2">
        {DEV_PERSONAS.map((p) => (
          <button
            key={p.clerkId}
            type="button"
            onClick={() => choose(p.clerkId)}
            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-gray-200 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10"
          >
            <span>
              <span className="font-semibold text-white">{p.fullName}</span>
              <span className="block text-xs text-gray-500">{p.email}</span>
            </span>
            <span className="text-xs text-indigo-300">{ROLE_LABEL[p.role]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function SignIn(_props: Record<string, unknown>) {
  return <DevSignInCard title="Sign in" subtitle="Choose a seeded development account." />;
}

export function SignUp(_props: Record<string, unknown>) {
  return <DevSignInCard title="Create your account" subtitle="Choose a seeded development account." />;
}

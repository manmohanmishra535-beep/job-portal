import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[520px] max-w-full -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[100px]"
      />
      <div className="relative flex w-full max-w-md justify-center">
        <SignIn
          appearance={{
            elements: {
              card: 'glass-panel bg-[#0f172a]/95 border border-white/10 shadow-2xl rounded-3xl',
              headerTitle: 'text-white font-heading font-extrabold text-2xl',
              headerSubtitle: 'text-slate-400 text-sm',
              formButtonPrimary:
                'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-500/25',
              formFieldInput:
                'bg-white/5 border border-white/10 text-white rounded-xl focus:border-indigo-500/70',
              formFieldLabel: 'text-slate-300 text-xs font-semibold',
              footerActionLink: 'text-indigo-400 hover:text-indigo-300 font-semibold',
            },
          }}
        />
      </div>
    </div>
  );
}

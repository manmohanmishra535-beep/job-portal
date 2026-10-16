import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md flex justify-center">
        <SignIn
          appearance={{
            elements: {
              card: 'glass-panel bg-[#0f172a]/95 border border-white/10 shadow-2xl rounded-3xl',
              headerTitle: 'text-white font-heading font-extrabold text-2xl',
              headerSubtitle: 'text-gray-400 text-sm',
              formButtonPrimary:
                'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-500/25',
              formFieldInput:
                'bg-white/5 border border-white/10 text-white rounded-xl focus:border-indigo-500',
              formFieldLabel: 'text-gray-300 text-xs font-semibold',
              footerActionLink: 'text-indigo-400 hover:text-indigo-300 font-semibold',
            },
          }}
        />
      </div>
    </div>
  );
}

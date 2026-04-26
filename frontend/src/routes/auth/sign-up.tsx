import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { registerPasskey } from '../../lib/webauthn'
import { useState } from 'react'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpComponent,
})

function SignUpComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      handle: '',
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);

      try {
        const handle = value.handle;

        const regResponse = await registerPasskey(handle);
        console.log('Registration successful:', regResponse);
        
        alert('Passkey created! (Waiting for server verification implementation)');
      } catch (err: any) {
        if (err.name === 'InvalidStateError') {
          throw new Error('This device is already registered.');
        } else {
          throw new Error(err.message || 'Registration failed');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] p-6 font-sans text-[#1d1d1f] dark:text-[#f5f5f7]">
      <div className="w-full max-w-[420px] bg-white dark:bg-[#2d2d2f] border border-[#d1d1d6] dark:border-[#424245] rounded-[12px] shadow-sm overflow-hidden">
        {/* Frame Header Style */}
        <div className="px-6 py-4 border-bottom border-[#d1d1d6] dark:border-[#424245] bg-[#f5f5f7] dark:bg-[#1d1d1f] flex justify-between items-center">
          <h1 className="text-[0.75rem] font-medium text-[#86868b] uppercase tracking-wider">Passkey Registration</h1>
          <div className="flex items-center gap-1.5 text-[0.7rem] text-[#34c759]">
            <div className="w-1.5 h-1.5 bg-[#34c759] rounded-full" />
            Secure
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-[1.5rem] font-semibold mb-1">Create Account</h2>
            <p className="text-[0.9rem] text-[#86868b]">Set up your identity with a secure passkey.</p>
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }} 
            className="space-y-6"
            noValidate
          >
            <form.Field
              name="handle"
              validators={{
                onChange: ({ value }) => 
                  !value ? 'Username is required' : undefined,
                onBlur: ({ value }) =>
                  !value ? 'Username is required' : undefined,
              }}
              children={(field) => {
                const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

                return (
                  <div>
                    <label htmlFor={field.name} className="block text-[0.7rem] text-[#86868b] uppercase tracking-wider font-semibold mb-2">
                      Author Handle
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                      autoFocus
                      autoComplete="username webauthn"
                      aria-invalid={hasError}
                      aria-describedby={hasError ? `${field.name}-error` : undefined}
                      className={`w-full px-3 py-2.5 bg-[#f5f5f7] dark:bg-[#1d1d1f] border rounded-[8px] text-[0.95rem] transition-all focus:outline-none focus:ring-2 ${
                        hasError 
                          ? 'border-[#ff3b30] focus:ring-[#ff3b30] text-[#ff3b30] placeholder-[#ff3b30]/50' 
                          : 'border-[#d1d1d6] dark:border-[#424245] focus:ring-[#0071e3] placeholder-[#aeaeb2]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="e.g. johndoe"
                    />
                    {hasError ? (
                      <div id={`${field.name}-error`} role="alert" className="mt-2 text-[0.8rem] text-[#ff3b30]">
                        {field.state.meta.errors.join(', ')}
                      </div>
                    ) : null}
                  </div>
                );
              }}
            />

            <form.Subscribe
              selector={(state) => [state.errors]}
              children={([formErrors]) => 
                formErrors.length > 0 ? (
                  <div role="alert" className="p-3 bg-[#ff3b30]/10 text-[#ff3b30] text-[0.85rem] rounded-[8px] border border-[#ff3b30]/20">
                    {formErrors.join(', ')}
                  </div>
                ) : null
              }
            />

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button 
                  type="submit" 
                  disabled={!canSubmit || isSubmitting || isLoading}
                  className="w-full h-11 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium rounded-[8px] text-[0.9rem] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  {isSubmitting || isLoading ? 'Creating Passkey...' : 'Continue'}
                </button>
              )}
            />
          </form>

          <div className="mt-10 pt-6 border-t border-[#d1d1d6] dark:border-[#424245] text-center">
            <p className="text-[0.85rem] text-[#86868b]">
              Already have an account?{' '}
              <Link to="/auth/sign-in" className="text-[#0071e3] hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-[0.7rem] text-[#86868b] uppercase tracking-[0.1em] text-center">
        Veracity Blog <span className="mx-1">•</span> Powered by Superpowers
      </div>
    </div>
  )
}

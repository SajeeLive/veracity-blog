import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { registerPasskey } from '../../lib/webauthn'
import { useTransition, useReducer } from 'react'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpComponent,
})

// --- Registration State Machine ---

type RegistrationState = 
  | { status: 'idle' }
  | { status: 'registering' }
  | { status: 'error'; message: string }
  | { status: 'success' };

type RegistrationAction = 
  | { type: 'START' }
  | { type: 'FAIL'; message: string }
  | { type: 'SUCCESS' }
  | { type: 'RETRY' };

function registrationReducer(state: RegistrationState, action: RegistrationAction): RegistrationState {
  switch (action.type) {
    case 'START': 
      return { status: 'registering' };
    case 'FAIL': 
      return { status: 'error', message: action.message };
    case 'SUCCESS': 
      return { status: 'success' };
    case 'RETRY': 
      return { status: 'idle' };
    default: 
      return state;
  }
}

function useRegistrationFlow() {
  const [state, dispatch] = useReducer(registrationReducer, { status: 'idle' });

  const startRegistration = () => dispatch({ type: 'START' });
  const failRegistration = (message: string) => dispatch({ type: 'FAIL', message });
  const succeedRegistration = () => dispatch({ type: 'SUCCESS' });
  const retryRegistration = () => dispatch({ type: 'RETRY' });

  return { state, startRegistration, failRegistration, succeedRegistration, retryRegistration };
}

// --- Component ---

function SignUpComponent() {
  const [isPending, startTransition] = useTransition();
  const flow = useRegistrationFlow();

  const form = useForm({
    defaultValues: {
      handle: '',
    },
    onSubmit: async ({ value }) => {
      // If we are in an error state, a submit acts as a retry
      if (flow.state.status === 'error') {
        flow.retryRegistration();
      }

      flow.startRegistration();

      try {
        const handle = value.handle;

        const regResponse = await registerPasskey(handle);
        console.log('Registration successful:', regResponse);
        
        flow.succeedRegistration();
      } catch (err: any) {
        if (err.name === 'InvalidStateError') {
          flow.failRegistration('This device is already registered.');
        } else {
          flow.failRegistration(err.message || 'Registration failed');
        }
      }
    },
  });

  const isFormDisabled = isPending || flow.state.status === 'registering';

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
          
          {/* Temporary Success Message */}
          {flow.state.status === 'success' && (
            <div className="mb-6 p-4 bg-[#34c759]/10 border border-[#34c759]/20 rounded-[8px] text-center">
              <h3 className="text-[#34c759] font-medium mb-1">Passkey Created!</h3>
              <p className="text-[#34c759] text-[0.85rem] opacity-90">Waiting for server verification implementation.</p>
            </div>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              startTransition(async () => {
                await form.handleSubmit();
              });
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
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        // Clear reducer error on typing if needed
                        if (flow.state.status === 'error') flow.retryRegistration();
                      }}
                      disabled={isFormDisabled}
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

            {/* Reducer Error State */}
            {flow.state.status === 'error' && (
              <div role="alert" className="p-3 bg-[#ff3b30]/10 text-[#ff3b30] text-[0.85rem] rounded-[8px] border border-[#ff3b30]/20">
                {flow.state.message}
              </div>
            )}

            <form.Subscribe
              selector={(state) => [state.canSubmit]}
              children={([canSubmit]) => {
                let buttonText = 'Continue';
                if (isFormDisabled) buttonText = 'Creating Passkey...';
                if (flow.state.status === 'error') buttonText = 'Try Again';

                return (
                  <button 
                    type="submit" 
                    disabled={!canSubmit || isFormDisabled}
                    className="w-full h-11 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium rounded-[8px] text-[0.9rem] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                  >
                    {buttonText}
                  </button>
                );
              }}
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

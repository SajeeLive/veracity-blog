import { useReducer } from 'react';

export type FormStatus = 'idle' | 'submitting' | 'error' | 'success';

export interface FormState {
  status: FormStatus;
  message?: string;
}

export type FormAction =
  | { type: 'SUBMIT' }
  | { type: 'FAIL'; message: string }
  | { type: 'SUCCESS' }
  | { type: 'RETRY' };

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SUBMIT':
      return { status: 'submitting' };
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

export function useFormFlow() {
  const [state, dispatch] = useReducer(formReducer, { status: 'idle' });

  const startSubmit = () => dispatch({ type: 'SUBMIT' });
  const failSubmit = (message: string) => dispatch({ type: 'FAIL', message });
  const succeedSubmit = () => dispatch({ type: 'SUCCESS' });
  const retrySubmit = () => dispatch({ type: 'RETRY' });

  return {
    state,
    startSubmit,
    failSubmit,
    succeedSubmit,
    retrySubmit,
  };
}

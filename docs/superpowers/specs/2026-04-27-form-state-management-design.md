# Form State Management Design

## Goal
Implement a consistent Finite State Machine (FSM) pattern for form state management in the blog writing and editing routes, using `useReducer` and shared constants for validation.

## Architecture
- **Shared Constants**: Centralize `BLOG_LIMITS` in both backend and frontend to ensure validation consistency.
- **Finite State Machine (FSM)**: Use `useReducer` to manage the lifecycle of form submissions (idle, submitting, error, success).
- **Hook-based Logic**: Encapsulate the FSM logic into a reusable or local hook (`useFormFlow`) to decouple state transitions from UI components.

## Technical Details

### Backend Constants
Update `backend/src/my-desk/my-desk.types.ts`:
- Define `BLOG_LIMITS` object.
- Update `CreateMyBlogSchema` and `UpdateMyBlogSchema` to use these constants.

### Frontend FSM Implementation
Files: `frontend/src/routes/my-desk/blog/write.tsx` and `frontend/src/routes/my-desk/blog/$blogId.tsx`.

**State Definition:**
```typescript
type FormStatus = 'idle' | 'submitting' | 'error' | 'success';

interface FormState {
  status: FormStatus;
  error?: string;
}

type FormAction =
  | { type: 'SUBMIT' }
  | { type: 'FAIL'; error: string }
  | { type: 'SUCCESS' }
  | { type: 'RETRY' };
```

**Reducer Logic:**
- `SUBMIT`: Transition to `submitting`.
- `FAIL`: Transition to `error` with message.
- `SUCCESS`: Transition to `success`.
- `RETRY`: Transition back to `idle`.

**Integration:**
- The machine will control button labels, disabled states, and error banner visibility.
- TanStack Query's `onSuccess` and `onError` callbacks will trigger machine transitions.

## Testing Strategy
- Verify that character limits on both ends are enforced correctly.
- Ensure the UI correctly reflects each state of the FSM (e.g., button says "Authenticating..." or "Saving..." and then "Success" or shows an error).
- Confirm that manual retry or field changes reset the error state.

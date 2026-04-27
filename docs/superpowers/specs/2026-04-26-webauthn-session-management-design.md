# WebAuthn Session Management Design

**Goal:** Issue a secure, HTTP-only session cookie containing a JWT after successful WebAuthn registration/login, and use it to authenticate subsequent tRPC requests.

## Architecture

### Backend

1.  **Auth Infrastructure:**
    *   Install `cookie-parser` and `jsonwebtoken`.
    *   Create `AuthService` to handle JWT signing (`signSession`) and verification (`verifySession`).
    *   Claims: `sub` (User ID), `handle` (Author handle), `iat`, `exp` (7 days).
2.  **tRPC Context:**
    *   Update `TrpcService.createContext` to:
        *   Read the `session` cookie.
        *   Verify the JWT using `AuthService`.
        *   Attach `{ user: { id: string, handle: string } | null }` to the context.
3.  **Procedure Authentication:**
    *   Create an `authedProcedure` in `TrpcService` that throws an `UNAUTHORIZED` error if `ctx.user` is missing.
4.  **WebAuthn Integration:**
    *   Modify `WebauthnService.verifyRegistration` to return the user info upon success.
    *   Update `WebauthnRouter.verifyRegistration` to set the `session` cookie using the response object.

### Frontend

1.  **tRPC Client:**
    *   Update `frontend/src/lib/trpc/client.ts` to include `credentials: 'include'` in `httpBatchLink`.
2.  **Authentication State:**
    *   Update `useAppStore` to include `{ user: { id: string, handle: string } | null }`.
    *   Implement a `getMe` query in a new `AuthRouter` to verify session on app load.

### New Auth Router

*   **`getMe`:** Query that returns `ctx.user`.
*   **`signOut`:** Mutation that clears the `session` cookie.

## Data Flow

1.  **Registration:** Client calls `verifyRegistration` -> Server verifies -> Server signs JWT -> Server sets `session` cookie -> Server returns `{ verified: true }`.
2.  **Authenticated Request:** Client calls a procedure -> Browser sends `session` cookie -> tRPC middleware verifies JWT -> Procedure executes with `ctx.user`.

## Error Handling

*   **Expired Token:** tRPC middleware fails, returns `UNAUTHORIZED`. Client clears state.
*   **Missing Cookie:** tRPC context sets `user: null`. `authedProcedure` blocks access.

## Success Criteria

*   `session` cookie is present in browser after sign-up.
*   tRPC requests include the cookie.
*   The server can identify the user via `ctx.user`.

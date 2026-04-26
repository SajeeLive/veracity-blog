# WebAuthn Client Integration Design

## Architecture

We are implementing the client-side WebAuthn registration flow using a centralized utility pattern (Option 2). This keeps the browser-specific `@simplewebauthn/browser` logic isolated from UI components.

## Components

### 1. Library Installation
- Install `@simplewebauthn/browser` in the frontend application.

### 2. WebAuthn Utility (`frontend/src/lib/webauthn.ts`)
A dedicated module to handle passkey operations.
- `registerPasskey(handle: string)`:
  - Calls `trpc.webauthn.getRegistrationOptions.query({ handle })`.
  - Passes the resulting options to `startRegistration({ optionsJSON })`.
  - Returns the authenticator's response, ready to be sent to the server for verification.

### 3. UI Integration (`frontend/src/routes/auth/sign-up.tsx`)
- The Sign Up component will collect the user's `handle` (username).
- On submission, it will invoke `registerPasskey(handle)`.
- It will handle loading states, success messages, and specific WebAuthn errors (e.g., `InvalidStateError` if the user is already registered).

## Data Flow

1. User submits `handle` via UI.
2. UI calls `registerPasskey(handle)`.
3. Utility fetches `PublicKeyCredentialCreationOptions` via tRPC.
4. Utility invokes browser's passkey modal via `startRegistration`.
5. Browser returns `RegistrationResponseJSON`.
6. Utility returns response to UI.
7. (Pending Backend) UI sends response to server `verifyRegistration` tRPC endpoint.

## Future Considerations
- The verification step is dependent on the backend `verifyRegistrationResponse` procedure, which is not yet implemented. The UI will pause at returning the successful `RegistrationResponseJSON` until that endpoint is available.
- `requireUserPresence: false` will be noted for the future server verification implementation, per documentation, though Auto Register is currently disabled.

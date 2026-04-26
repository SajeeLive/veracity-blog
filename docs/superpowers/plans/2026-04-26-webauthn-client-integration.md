# WebAuthn Client Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the frontend with the backend WebAuthn registration procedure and implement the client-side passkey creation flow.

**Architecture:** Centralized WebAuthn utility (`webauthn.ts`) wrapping `@simplewebauthn/browser` and tRPC client calls.

**Tech Stack:** React, tRPC, @simplewebauthn/browser, TypeScript.

---

### Task 1: Install Dependencies

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: Install `@simplewebauthn/browser`**

Run: `npm install @simplewebauthn/browser` (in `frontend` directory)
Expected: `package.json` updated with `@simplewebauthn/browser`.

- [ ] **Step 2: Commit**

```bash
git add frontend/package.json frontend/pnpm-lock.yaml
git commit -m "chore(frontend): install @simplewebauthn/browser"
```

---

### Task 2: Create WebAuthn Utility

**Files:**
- Create: `frontend/src/lib/webauthn.ts`

- [ ] **Step 1: Implement `registerPasskey` function**

```typescript
import { startRegistration } from '@simplewebauthn/browser';
import { trpc } from './trpc/client';

/**
 * Initiates the WebAuthn registration flow.
 * 1. Fetches registration options from the server via tRPC.
 * 2. Invokes the browser's native passkey registration modal.
 * 3. Returns the authenticator response.
 */
export const registerPasskey = async (handle: string) => {
  // 1. Get options from server
  const options = await trpc.webauthn.getRegistrationOptions.query({ handle });

  // 2. Start browser registration
  const attResp = await startRegistration({ optionsJSON: options });

  return attResp;
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/lib/webauthn.ts
git commit -m "feat(frontend): add webauthn registration utility"
```

---

### Task 3: Integrate Registration into Sign Up UI

**Files:**
- Modify: `frontend/src/routes/auth/sign-up.tsx`

- [ ] **Step 1: Update Sign Up component to use WebAuthn utility**

```typescript
// Add imports
import { registerPasskey } from '../../lib/webauthn';
import { useState } from 'react';

// Inside SignUp component:
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const handle = formData.get('handle') as string;

    if (!handle) throw new Error('Username is required');

    const regResponse = await registerPasskey(handle);
    console.log('Registration successful:', regResponse);
    
    // Note: Verification step will be added once backend is ready
    alert('Passkey created! (Waiting for server verification implementation)');
  } catch (err: any) {
    if (err.name === 'InvalidStateError') {
      setError('This device is already registered.');
    } else {
      setError(err.message || 'Registration failed');
    }
  } finally {
    setIsLoading(false);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/routes/auth/sign-up.tsx
git commit -m "feat(frontend): integrate webauthn registration into sign-up UI"
```

---

### Task 4: Manual Verification

- [ ] **Step 1: Verify build**

Run: `npm run build` in `frontend`
Expected: Success.

- [ ] **Step 2: Commit (if any fixes needed)**

```bash
git commit -m "fix(frontend): build issues in webauthn integration"
```

# WebAuthn Configuration Implementation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide derived WebAuthn configuration (rpID, origin, rpName) to the NestJS `ConfigService` using a custom configuration loader.

**Architecture:** Create a custom NestJS configuration loader using `registerAs` that derives values from the existing `FRONTEND_URL` environment variable.

**Tech Stack:** NestJS, `@nestjs/config`, TypeScript

---

### Task 1: Create WebAuthn Configuration Loader

**Files:**
- Create: `backend/src/config/webauthn.config.ts`

- [ ] **Step 1: Write the configuration loader**

```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('webauthn', () => {
  const frontendUrl = process.env.FRONTEND_URL;
  
  if (!frontendUrl) {
    throw new Error('FRONTEND_URL is not defined in environment');
  }

  const url = new URL(frontendUrl);
  
  return {
    rpName: 'Veracity Blogger',
    rpID: url.hostname,
    origin: frontendUrl.replace(/\/$/, ''), // Remove trailing slash if exists
  };
});
```

- [ ] **Step 2: Commit loader file**

```bash
git add backend/src/config/webauthn.config.ts
git commit -m "feat(backend): add webauthn custom configuration loader"
```

### Task 2: Register Loader in AppModule

**Files:**
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Update AppModule imports**

```typescript
// ... existing imports
import webauthnConfig from './config/webauthn.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
      load: [webauthnConfig], // Add this line
      envFilePath: '.env',
      expandVariables: true,
    }),
// ...
```

- [ ] **Step 2: Commit changes**

```bash
git add backend/src/app.module.ts
git commit -m "feat(backend): register webauthn configuration loader in AppModule"
```

### Task 3: Verification

- [ ] **Step 1: Create temporary test controller or check startup**

Since we don't have a direct test for this yet, we can verify by running the backend to ensure it starts without errors (validation and loader logic run on startup).

Run: `cd backend && npm run start`
Expected: Nest application starts successfully.

- [ ] **Step 2: (Optional) Add a unit test for the config loader**

**Files:**
- Create: `backend/src/config/webauthn.config.spec.ts`

```typescript
import webauthnConfig from './webauthn.config';

describe('webauthnConfig', () => {
  it('should derive rpID and origin from FRONTEND_URL', () => {
    process.env.FRONTEND_URL = 'http://localhost:5173/';
    const config = webauthnConfig();
    expect(config.rpID).toBe('localhost');
    expect(config.origin).toBe('http://localhost:5173');
    expect(config.rpName).toBe('Veracity Blogger');
  });
});
```

- [ ] **Step 3: Run the test**

Run: `cd backend && npx jest src/config/webauthn.config.spec.ts`
Expected: Test passes.

- [ ] **Step 4: Cleanup and Commit**

Remove the spec if not wanted, or keep it for safety.
```bash
git add backend/src/config/webauthn.config.spec.ts
git commit -m "test(backend): add unit test for webauthn configuration loader"
```

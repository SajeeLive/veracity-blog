# WebAuthn Session Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement secure session management using JWTs in HTTP-only cookies, issued after WebAuthn registration/login.

**Architecture:** Use `jsonwebtoken` for signing/verifying tokens, `cookie-parser` for handling cookies in NestJS/Express, and update tRPC context to provide user information to procedures.

**Tech Stack:** NestJS, tRPC, jsonwebtoken, cookie-parser, Zod.

---

### Task 1: Environment and Dependencies

**Files:**
- Modify: `backend/package.json`
- Modify: `backend/src/config/env.validation.ts`
- Create: `backend/src/config/auth.config.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Install dependencies**

Run: `pnpm --filter backend add jsonwebtoken cookie-parser && pnpm --filter backend add -D @types/jsonwebtoken @types/cookie-parser`

- [ ] **Step 2: Update `envSchema`**

```typescript
// backend/src/config/env.validation.ts
export const envSchema = z.object({
  // ... existing ...
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  COOKIE_SECRET: z.string().min(32, 'COOKIE_SECRET must be at least 32 chars'),
});
```

- [ ] **Step 3: Create `auth.config.ts`**

```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  expiresIn: '7d',
}));
```

- [ ] **Step 4: Update `AppModule`**

Add `authConfig` to `ConfigModule` loads.

- [ ] **Step 5: Commit**

```bash
git add backend/package.json backend/src/config/ backend/src/app.module.ts
git commit -m "chore(auth): add jwt and cookie dependencies and config"
```

---

### Task 2: Implement AuthService

**Files:**
- Create: `backend/src/auth/auth.service.ts`
- Create: `backend/src/auth/auth.module.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Create `AuthService`**

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export interface SessionPayload {
  sub: string;
  handle: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  signSession(payload: SessionPayload): string {
    const secret = this.configService.get<string>('auth.jwtSecret')!;
    const expiresIn = this.configService.get<string>('auth.expiresIn')!;
    return jwt.sign(payload, secret, { expiresIn });
  }

  verifySession(token: string): SessionPayload | null {
    const secret = this.configService.get<string>('auth.jwtSecret')!;
    try {
      return jwt.verify(token, secret) as SessionPayload;
    } catch {
      return null;
    }
  }
}
```

- [ ] **Step 2: Register `AuthModule` as Global**

- [ ] **Step 3: Commit**

```bash
git add backend/src/auth/ backend/src/app.module.ts
git commit -m "feat(auth): implement AuthService for JWT management"
```

---

### Task 3: Update tRPC Context and Middleware

**Files:**
- Modify: `backend/src/main.ts`
- Modify: `backend/src/trpc/trpc.service.ts`

- [ ] **Step 1: Enable `cookie-parser` in `main.ts`**

```typescript
import * as cookieParser from 'cookie-parser';
// ...
const configService = app.get(ConfigService);
app.use(cookieParser(configService.get('auth.cookieSecret')));
```

- [ ] **Step 2: Update tRPC Context**

```typescript
// backend/src/trpc/trpc.service.ts
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';

export interface Context {
  req: Request;
  res: Response;
  user: { id: string, handle: string } | null;
}

@Injectable()
export class TrpcService {
  constructor(private readonly authService: AuthService) {}

  async createContext({ req, res }: { req: Request, res: Response }): Promise<Context> {
    const token = req.cookies['session'];
    let user = null;

    if (token) {
      const payload = this.authService.verifySession(token);
      if (payload) {
        user = { id: payload.sub, handle: payload.handle };
      }
    }

    return { req, res, user };
  }

  readonly trpc = initTRPC.context<Context>().create({
    transformer: superjson,
  });

  readonly procedure = this.trpc.procedure;
  readonly authedProcedure = this.trpc.procedure.use(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({ ctx: { user: ctx.user } });
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/main.ts backend/src/trpc/trpc.service.ts
git commit -m "feat(auth): integrate cookie-parser and update tRPC context"
```

---

### Task 4: Implement Session Issuance and Auth Router

**Files:**
- Modify: `backend/src/webauthn/webauthn.service.ts`
- Modify: `backend/src/webauthn/webauthn.router.ts`
- Create: `backend/src/auth/auth.router.ts`
- Modify: `backend/src/trpc/app.router.ts`

- [ ] **Step 1: Update `verifyRegistration` in `WebauthnService`**
Return user info `{ id, handle }` on success.

- [ ] **Step 2: Update `WebauthnRouter` to set cookie**

```typescript
// in verifyRegistration mutation
const userInfo = await this.webauthnService.verifyRegistration(input.handle, input.response);
const token = this.authService.signSession({ sub: userInfo.id, handle: userInfo.handle });
ctx.res.cookie('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
return { verified: true };
```

- [ ] **Step 3: Create `AuthRouter`**
Implement `getMe` (query) and `signOut` (mutation).

- [ ] **Step 4: Commit**

```bash
git add backend/src/webauthn/ backend/src/auth/ backend/src/trpc/app.router.ts
git commit -m "feat(auth): implement session issuance and AuthRouter"
```

---

### Task 5: Frontend Integration

**Files:**
- Modify: `frontend/src/lib/trpc/client.ts`
- Modify: `frontend/src/store/appStore.ts`
- Modify: `frontend/src/routes/__root.tsx`

- [ ] **Step 1: Update tRPC client**
Set `credentials: 'include'` in `httpBatchLink`.

- [ ] **Step 2: Update `AppStore`**
Add `user` state and `setUser` method. Update `login`/`logout` to sync with backend.

- [ ] **Step 3: Initial Auth Check**
Call `auth.getMe` in `__root.tsx` or similar to populate `AppStore` on load.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/lib/trpc/client.ts frontend/src/store/appStore.ts frontend/src/routes/__root.tsx
git commit -m "feat(auth): integrate session handling in frontend"
```

# WebAuthn Registration Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the server-side verification of WebAuthn registration responses and persist user/passkey data.

**Architecture:** Extend the `WebauthnService` and `WebauthnRouter` to handle the `verifyRegistration` ceremony. Use `@simplewebauthn/server` for verification and Prisma for atomic persistence of user and credential data.

**Tech Stack:** NestJS, Prisma, tRPC, @simplewebauthn/server, Zod.

---

### Task 1: Update WebAuthn Types

**Files:**
- Modify: `backend/src/webauthn/webauthn.types.ts`

- [ ] **Step 1: Add `verifyRegistrationSchema`**

```typescript
import { z } from 'zod';

export const getRegistrationOptionsSchema = z.object({
  handle: z.string().min(1, 'Handle is required'),
});

export const verifyRegistrationSchema = z.object({
  handle: z.string().min(1, 'Handle is required'),
  response: z.any(), // RegistrationResponseJSON
});
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/webauthn/webauthn.types.ts
git commit -m "feat(webauthn): add verifyRegistrationSchema"
```

---

### Task 2: Implement WebauthnService.verifyRegistration

**Files:**
- Create: `backend/src/webauthn/webauthn.service.spec.ts`
- Modify: `backend/src/webauthn/webauthn.service.ts`

- [ ] **Step 1: Create failing test for `verifyRegistration`**

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { WebauthnService } from './webauthn.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('WebauthnService', () => {
  let service: WebauthnService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebauthnService,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn(), create: jest.fn() },
            authChallenge: { findFirst: jest.fn(), delete: jest.fn() },
            passkey: { create: jest.fn() },
            $transaction: jest.fn((cb) => cb(prisma)),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn((key) => {
            if (key === 'webauthn.origin') return 'http://localhost:5173';
            if (key === 'webauthn.rpID') return 'localhost';
            return null;
          })},
        },
      ],
    }).compile();

    service = module.get<WebauthnService>(WebauthnService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should throw UnauthorizedException if challenge not found', async () => {
    (prisma.authChallenge.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(service.verifyRegistration('test', { response: { clientDataJSON: 'eyJjaGFsbGVuZ2UiOiJjaGFsbGVuZ2UifQ' } } as any))
      .rejects.toThrow(UnauthorizedException);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test backend/src/webauthn/webauthn.service.spec.ts`
Expected: FAIL (method not defined)

- [ ] **Step 3: Implement `verifyRegistration` in `WebauthnService`**

```typescript
// backend/src/webauthn/webauthn.service.ts

import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class WebauthnService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getRegistrationOptions(handle: string) {
    // ... existing implementation ...
  }

  async verifyRegistration(handle: string, response: any) {
    const clientDataJSON = JSON.parse(
      Buffer.from(response.response.clientDataJSON, 'base64').toString(),
    );
    const challengeStr = clientDataJSON.challenge;

    const challenge = await this.prisma.authChallenge.findFirst({
      where: {
        challenge: challengeStr,
        expiresAt: { gt: new Date() },
      },
    });

    if (!challenge) {
      throw new UnauthorizedException('Invalid or expired challenge');
    }

    const rpID = this.configService.get<string>('webauthn.rpID')!;
    const origin = this.configService.get<string>('webauthn.origin')!;

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: challenge.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: false,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credential, credentialDeviceType, credentialBackedUp } =
        registrationInfo;

      await this.prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: {
            id: challenge.userId!,
            handle,
          },
        });

        await tx.passkey.create({
          data: {
            id: credential.id,
            publicKey: Buffer.from(credential.publicKey),
            webauthnUserId: challenge.userId!,
            counter: credential.counter,
            deviceType: credentialDeviceType,
            backedUp: credentialBackedUp,
            transports: credential.transports?.join(','),
            userId: challenge.userId!,
          },
        });

        await tx.authChallenge.delete({
          where: { id: challenge.id },
        });
      });

      return { verified: true };
    }

    return { verified: false };
  }
}
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `pnpm test backend/src/webauthn/webauthn.service.spec.ts`

- [ ] **Step 5: Commit**

```bash
git add backend/src/webauthn/webauthn.service.ts backend/src/webauthn/webauthn.service.spec.ts
git commit -m "feat(webauthn): implement verifyRegistration in service"
```

---

### Task 3: Implement WebauthnRouter.verifyRegistration

**Files:**
- Modify: `backend/src/webauthn/webauthn.router.ts`

- [ ] **Step 1: Add `verifyRegistration` procedure to `WebauthnRouter`**

```typescript
import { Injectable } from '@nestjs/common';
import { TrpcService } from '../trpc/trpc.service';
import { WebauthnService } from './webauthn.service';
import {
  getRegistrationOptionsSchema,
  verifyRegistrationSchema,
} from './webauthn.types';

@Injectable()
export class WebauthnRouter {
  public router;

  constructor(
    private readonly trpc: TrpcService,
    private readonly webauthnService: WebauthnService,
  ) {
    this.router = this.trpc.router({
      getRegistrationOptions: this.trpc.procedure
        .input(getRegistrationOptionsSchema)
        .query(async ({ input }) => {
          return await this.webauthnService.getRegistrationOptions(
            input.handle,
          );
        }),
      verifyRegistration: this.trpc.procedure
        .input(verifyRegistrationSchema)
        .mutation(async ({ input }) => {
          return await this.webauthnService.verifyRegistration(
            input.handle,
            input.response,
          );
        }),
    });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/webauthn/webauthn.router.ts
git commit -m "feat(webauthn): add verifyRegistration procedure to router"
```

---

### Task 4: Verification and Final Checks

- [ ] **Step 1: Run all backend tests**

Run: `pnpm --filter backend test`

- [ ] **Step 2: Final Manual Verification**
Ensure the service handles successful registration and persistence correctly.

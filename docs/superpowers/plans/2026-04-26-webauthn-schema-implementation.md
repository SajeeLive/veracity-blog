# WebAuthn Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update Prisma schema and seed script to support WebAuthn, removing legacy user fields.

**Architecture:** 
- Drop `email`, `firstName`, `lastName` from `User`.
- Add `Passkey` table for authenticator credentials.
- Add `AuthChallenge` table for ceremony state.
- Update `seed.ts` to reflect model changes.

**Tech Stack:** Prisma, PostgreSQL, NestJS.

---

### Task 1: Update Prisma Schema

**Files:**
- Modify: `backend/prisma/schema.prisma`

- [ ] **Step 1: Update User model and add Passkey/AuthChallenge models**

```prisma
model User {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // One-to-one relationship with Author
  author    Author?
  
  // WebAuthn Credentials
  passkeys  Passkey[]

  @@map("users")
}

model Passkey {
  id             String   @id // credentialID (Base64URL)
  publicKey      Bytes    @map("public_key")
  webauthnUserId String   @map("webauthn_user_id") // Base64URL
  counter        BigInt
  deviceType     String   @map("device_type")
  backedUp       Boolean  @map("backed_up")
  transports     String?  // CSV string of transports
  createdAt      DateTime @default(now()) @map("created_at")

  // Relation to User
  user   User   @relation(fields: [userId], references: [id])
  userId String @map("user_id")

  @@map("passkeys")
}

model AuthChallenge {
  id             String   @id @default(uuid())
  challenge      String
  expectedOrigin String   @map("expected_origin")
  expiresAt      DateTime @map("expires_at")
  createdAt      DateTime @default(now()) @map("created_at")

  // Optional link to user (set during login)
  userId String? @map("user_id")

  @@map("auth_challenges")
}
```

- [ ] **Step 2: Commit schema changes**

```bash
git add backend/prisma/schema.prisma
git commit -m "feat(db): update schema for webauthn"
```

---

### Task 2: Update Seed Script

**Files:**
- Modify: `backend/prisma/seed.ts`

- [ ] **Step 1: Refactor seed logic to remove legacy fields**

```typescript
// Replace loop body with:
  for (let i = 0; i < 10; i++) {
    const handle = handles[i];

    const user = await prisma.user.create({
      data: {
        author: {
          create: {
            handle,
          },
        },
      },
      include: { author: true },
    });

    if (user.author) {
      authors.push(user.author);
    }
    console.log(`Created Author: ${handle}`);
  }
```

- [ ] **Step 2: Commit seed updates**

```bash
git add backend/prisma/seed.ts
git commit -m "refactor(db): update seed for webauthn schema"
```

---

### Task 3: Apply Migration and Verify

**Files:**
- Execute: `pnpm` commands in `backend`

- [ ] **Step 1: Run migration**

Run: `pnpm prisma:migrate --name webauthn_schema` (Note: This will prompt to reset the DB as we are dropping columns).
Expected: Migration succeeds.

- [ ] **Step 2: Run seed**

Run: `pnpm prisma:seed`
Expected: 10 authors and 100 blogs created successfully.

- [ ] **Step 3: Verify with Prisma Studio (Optional)**

Run: `pnpm prisma:studio`
Expected: `User`, `Passkey`, and `AuthChallenge` tables are visible and populated correctly.

- [ ] **Step 4: Commit migration files**

```bash
git add backend/prisma/migrations/
git commit -m "feat(db): apply webauthn schema migration"
```

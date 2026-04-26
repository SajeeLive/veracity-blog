# WebAuthn Database Schema Design

**Goal:** Implement the database schema required for WebAuthn authentication in the Veracity Blog platform, removing legacy email-based identification fields.

**Architecture:**
- **User Identification:** The platform will use `Author.handle` as the primary identifier during the WebAuthn registration and login flows.
- **Credential Storage:** A dedicated `Passkey` table will store public keys and metadata associated with user authenticators.
- **Ceremony State:** An `AuthChallenge` table will store temporary challenges for both registration (session-based) and login (linked to user).

**Tech Stack:**
- **ORM:** Prisma
- **Database:** PostgreSQL
- **WebAuthn Utility:** `@simplewebauthn/server`

---

## 1. Database Schema Changes (`schema.prisma`)

### 1.1 `User` Model
Remove redundant attributes to achieve a "minimum friction" authentication experience.
- **Removed Fields:** `email`, `firstName`, `lastName`.
- **Remaining Fields:** `id`, `createdAt`, `updatedAt`, `author`.
- **New Relation:** `passkeys` (One-to-many with `Passkey`).

### 1.2 `Passkey` Model
Stores registered authenticator credentials.
- `id`: `String` @id (The `credentialID` returned by the browser, stored as Base64URL).
- `publicKey`: `Bytes` (Raw public key bytes).
- `webauthnUserId`: `String` (Internal user ID used by the authenticator, stored as Base64URL).
- `counter`: `BigInt` (Current authenticator counter).
- `deviceType`: `String` (e.g., 'singleDevice' | 'multiDevice').
- `backedUp`: `Boolean` (Credential backup status).
- `transports`: `String?` (Comma-separated list of transports: 'ble', 'nfc', 'usb', 'internal', 'hybrid').
- `userId`: `String` (Foreign key to `User`).
- `user`: `User` @relation.

### 1.3 `AuthChallenge` Model
Manages the temporary state required for the WebAuthn challenge/response ceremony.
- `id`: `String` @id @default(uuid()) (A temporary session ID sent to the client as a cookie).
- `challenge`: `String` (The actual Base64URL challenge).
- `expectedOrigin`: `String` (Stored to verify against the response origin).
- `userId`: `String?` (Optional. Set during login flows, null during registration).
- `expiresAt`: `DateTime` (Expiration timestamp, typically 5 minutes from creation).

---

## 2. Seed Data Updates (`seed.ts`)

The `seed.ts` script must be updated to reflect the new `User` model structure.
- Remove logic generating/saving `email`, `firstName`, and `lastName`.
- Maintain the 1:1 relationship between `User` and `Author`.
- Maintain the existing author handles to ensure logic depending on handles (like `BlogService.getAllBlogs`) remains functional.

---

## 3. Success Criteria
1. `prisma migrate dev` runs successfully, dropping the legacy columns and adding the new tables.
2. `pnpm prisma:generate` (in backend) produces a client with the new models.
3. `pnpm prisma:seed` (in backend) successfully populates the database with users, authors, and blogs.
4. Existing `BlogService` tests and logic continue to pass (as they rely on `Author.handle` rather than `User.email`).

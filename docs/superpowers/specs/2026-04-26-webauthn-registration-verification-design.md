# WebAuthn Registration Verification Design

**Goal:** Complete the WebAuthn registration flow by verifying the authenticator's response and storing the credential in the database.

**Architecture:**
- **Verification:** Use `@simplewebauthn/server` to validate the `RegistrationResponseJSON` against the stored challenge.
- **Persistence:** Create the `User` and `Passkey` records upon successful verification.
- **Cleanup:** Remove the temporary `AuthChallenge` after successful verification.

---

## 1. tRPC Procedure: `verifyRegistration`

### 1.1 Input Schema
```typescript
const verifyRegistrationSchema = z.object({
  handle: z.string().min(1),
  response: z.any(), // RegistrationResponseJSON from @simplewebauthn/types
});
```

### 1.2 Verification Logic
1. **Extract Challenge:** Decode `input.response.response.clientDataJSON` (Base64URL) and parse the JSON to extract the `challenge` string.
2. **Lookup Challenge:** Query `AuthChallenge` table:
   - Match `challenge` string.
   - Ensure `expiresAt > now`.
3. **Verify Response:** Call `verifyRegistrationResponse`:
   - `response`: `input.response`
   - `expectedChallenge`: `challenge.challenge`
   - `expectedOrigin`: `configService.get('webauthn.origin')`
   - `expectedRPID`: `configService.get('webauthn.rpID')`
   - `requireUserVerification`: `false` (as per sample code)
4. **Post-Verification (if `verified === true`):**
   - Extract `registrationInfo`: `credential`, `credentialDeviceType`, `credentialBackedUp`.
   - Start Prisma Transaction:
     - **Create User:**
       - `id`: `challenge.userId` (The UUID generated in `getRegistrationOptions`).
       - `handle`: `input.handle`.
     - **Create Passkey:**
       - `id`: `credential.id`.
       - `publicKey`: `credential.publicKey`.
       - `webauthnUserId`: `challenge.userId`.
       - `counter`: `credential.counter`.
       - `deviceType`: `credentialDeviceType`.
       - `backedUp`: `credentialBackedUp`.
       - `transports`: `credential.transports?.join(',')`.
       - `userId`: `challenge.userId`.
     - **Cleanup:** Delete the used `AuthChallenge`.
   - Return `{ verified: true }`.

---

## 2. Implementation Details

### 2.1 Handling BigInt
Prisma's `BigInt` for `Passkey.counter` needs to be handled correctly in tRPC (which uses `superjson` by default, so it should be fine).

### 2.2 Security Considerations
- **Origin & RPID:** Must strictly match the values configured in the environment.
- **Challenge Reuse:** The `AuthChallenge` must be deleted after one successful use to prevent replay attacks.
- **Timeout:** Expired challenges must be rejected.

---

## 3. Success Criteria
1. The `verifyRegistration` procedure successfully verifies a valid attestation response.
2. A new `User` and `Passkey` are created in the database.
3. The `AuthChallenge` is removed from the database.
4. The client receives `{ verified: true }`.

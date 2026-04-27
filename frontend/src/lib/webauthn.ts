import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { trpcClient } from './trpc/client';

/**
 * Initiates the WebAuthn registration flow.
 * 1. Fetches registration options from the server via tRPC.
 * 2. Invokes the browser's native passkey registration modal.
 * 3. Returns the authenticator response.
 */
export const registerPasskey = async (handle: string) => {
  // 1. Get options from server
  const options = await trpcClient.webauthn.getRegistrationOptions.query({ handle });

  // 2. Start browser registration
  const attResp = await startRegistration({ optionsJSON: options });

  return attResp;
};

/**
 * Initiates the WebAuthn authentication flow.
 * 1. Fetches authentication options from the server via tRPC.
 * 2. Invokes the browser's native passkey authentication modal.
 * 3. Returns the authenticator response.
 */
export const authenticatePasskey = async (handle: string) => {
  // 1. Get options from server
  const options = await trpcClient.webauthn.getAuthenticationOptions.query({ handle });

  // 2. Start browser authentication
  const asseResp = await startAuthentication({ optionsJSON: options });

  return asseResp;
};

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

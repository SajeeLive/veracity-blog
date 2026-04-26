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

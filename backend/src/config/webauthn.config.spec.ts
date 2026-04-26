import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import webauthnConfig from './webauthn.config';

describe('webauthnConfig', () => {
  let config: any;

  beforeEach(() => {
    jest.resetModules();
    process.env.FRONTEND_URL = 'http://localhost:3000';
    config = webauthnConfig();
  });

  it('should return rpName', () => {
    expect(config.rpName).toBe('Veracity Blogger');
  });

  it('should return rpID from FRONTEND_URL', () => {
    expect(config.rpID).toBe('localhost');
  });

  it('should return origin from FRONTEND_URL and remove trailing slash', () => {
    process.env.FRONTEND_URL = 'https://veracity.blog/';
    const configWithSlash = webauthnConfig();
    expect(configWithSlash.origin).toBe('https://veracity.blog');
  });

  it('should throw error if FRONTEND_URL is missing', () => {
    delete process.env.FRONTEND_URL;
    expect(() => webauthnConfig()).toThrow('FRONTEND_URL is not defined in environment');
  });
});

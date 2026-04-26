import { Test, TestingModule } from '@nestjs/testing';
import { WebauthnService } from './webauthn.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import * as simplewebauthn from '@simplewebauthn/server';

jest.mock('@simplewebauthn/server');

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
            authChallenge: { findFirst: jest.fn(), delete: jest.fn().mockResolvedValue({}) },
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

    const response = {
      response: {
        clientDataJSON: Buffer.from(JSON.stringify({ challenge: 'test-challenge' })).toString('base64url'),
      },
    };

    await expect(service.verifyRegistration('test', response as any))
      .rejects.toThrow(UnauthorizedException);
  });

  it('should throw ConflictException if handle is already taken during transaction', async () => {
    const challenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      userId: 'user-id',
    };
    (prisma.authChallenge.findFirst as jest.Mock).mockResolvedValue(challenge);
    (simplewebauthn.verifyRegistrationResponse as jest.Mock).mockResolvedValue({
      verified: true,
      registrationInfo: {
        credential: { id: 'cred-id', publicKey: new Uint8Array(), counter: 0 },
        credentialDeviceType: 'singleDevice',
        credentialBackedUp: true,
      },
    });

    const error: any = new Error('Unique constraint failed');
    error.code = 'P2002';
    (prisma.$transaction as jest.Mock).mockRejectedValue(error);

    const response = {
      response: {
        clientDataJSON: Buffer.from(JSON.stringify({ challenge: 'test-challenge' })).toString('base64url'),
      },
    };

    await expect(service.verifyRegistration('test', response as any))
      .rejects.toThrow(ConflictException);
  });

  it('should cleanup challenge on verification failure', async () => {
    const challenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      userId: 'user-id',
    };
    (prisma.authChallenge.findFirst as jest.Mock).mockResolvedValue(challenge);
    (simplewebauthn.verifyRegistrationResponse as jest.Mock).mockRejectedValue(new Error('Verification failed'));

    const response = {
      response: {
        clientDataJSON: Buffer.from(JSON.stringify({ challenge: 'test-challenge' })).toString('base64url'),
      },
    };

    await expect(service.verifyRegistration('test', response as any))
      .rejects.toThrow(BadRequestException);
    expect(prisma.authChallenge.delete).toHaveBeenCalledWith({ where: { id: 'challenge-id' } });
  });

  it('should successfully verify registration and create user/passkey', async () => {
    const challenge = {
      id: 'challenge-id',
      challenge: 'test-challenge',
      userId: 'user-id',
    };
    (prisma.authChallenge.findFirst as jest.Mock).mockResolvedValue(challenge);
    (simplewebauthn.verifyRegistrationResponse as jest.Mock).mockResolvedValue({
      verified: true,
      registrationInfo: {
        credential: { id: 'cred-id', publicKey: new Uint8Array(), counter: 0, transports: ['usb'] },
        credentialDeviceType: 'singleDevice',
        credentialBackedUp: true,
      },
    });

    const response = {
      response: {
        clientDataJSON: Buffer.from(JSON.stringify({ challenge: 'test-challenge' })).toString('base64url'),
      },
    };

    const result = await service.verifyRegistration('test', response as any);

    expect(result).toEqual({ verified: true });
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});

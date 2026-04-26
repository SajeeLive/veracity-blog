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

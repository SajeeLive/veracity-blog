import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  generateRegistrationOptions,
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
    if (!handle) {
      throw new BadRequestException('Handle is required');
    }

    // Check if user already exists
    const user = await this.prisma.user.findUnique({
      where: { handle },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    // New user registration flow
    const webauthnUserId = randomUUID();
    const rpName = this.configService.get<string>('webauthn.rpName')!;
    const rpID = this.configService.get<string>('webauthn.rpID')!;

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userName: handle,
      userDisplayName: handle,
      userID: Buffer.from(webauthnUserId),
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
    });

    // Store challenge in DB for verification
    await this.prisma.authChallenge.create({
      data: {
        challenge: options.challenge,
        expectedOrigin: this.configService.get<string>('webauthn.origin')!,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        userId: webauthnUserId, 
      },
    });

    return options;
  }
}

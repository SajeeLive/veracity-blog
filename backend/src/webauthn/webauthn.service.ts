import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
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

  async verifyRegistration(handle: string, response: any) {
    const clientDataJSON = JSON.parse(
      Buffer.from(response.response.clientDataJSON, 'base64').toString(),
    );
    const challengeStr = clientDataJSON.challenge;

    const challenge = await this.prisma.authChallenge.findFirst({
      where: {
        challenge: challengeStr,
        expiresAt: { gt: new Date() },
      },
    });

    if (!challenge) {
      throw new UnauthorizedException('Invalid or expired challenge');
    }

    const rpID = this.configService.get<string>('webauthn.rpID')!;
    const origin = this.configService.get<string>('webauthn.origin')!;

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: challenge.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: false,
      });
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credential, credentialDeviceType, credentialBackedUp } =
        registrationInfo;

      await this.prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: {
            id: challenge.userId!,
            handle,
          },
        });

        await tx.passkey.create({
          data: {
            id: credential.id,
            publicKey: Buffer.from(credential.publicKey),
            webauthnUserId: challenge.userId!,
            counter: credential.counter,
            deviceType: credentialDeviceType,
            backedUp: credentialBackedUp,
            transports: credential.transports?.join(','),
            userId: challenge.userId!,
          },
        });

        await tx.authChallenge.delete({
          where: { id: challenge.id },
        });
      });

      return { verified: true };
    }

    return { verified: false };
  }
}

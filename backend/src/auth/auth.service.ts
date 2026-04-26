import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export interface SessionPayload {
  sub: string;
  handle: string;
}

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly expiresIn: string;

  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.get<string>('auth.jwtSecret');
    const expires = this.configService.get<string>('auth.expiresIn');

    if (!secret) {
      throw new Error('auth.jwtSecret is not defined');
    }

    this.jwtSecret = secret;
    this.expiresIn = expires || '7d';
  }

  signSession(payload: SessionPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.expiresIn as any,
    });
  }

  verifySession(token: string): SessionPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as SessionPayload;
    } catch {
      return null;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/interfaces/jwtpayload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return hashedPassword;
  }
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  }
  async createTokens(id: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: id };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESSSECRET as any,
      expiresIn: process.env.ACCESSEXPIRE ?? ('5m' as any),
      algorithm: process.env.JWTALGORITHM ?? ('HS512' as any),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESHSECRET as any,
      expiresIn: process.env.REFRESHEXPIRE ?? ('7d' as any),
      algorithm: process.env.JWTALGORITHM ?? ('HS512' as any),
    });
    return { accessToken, refreshToken };
  }
  setCookie(name: string, token: string, response: Response): void {
    response.cookie(name, token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/auth/refresh_token',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: process.env.REFRESHSECRET,
      algorithms: process.env.JWTALGORITHM as any,
    });
    return payload;
  }
}

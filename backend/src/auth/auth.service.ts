import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/interfaces/jwtpayload.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

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

    // On hash le refresh token avant de le stocker — même principe que les mots de passe :
    // si la base est compromise, l'attaquant ne récupère pas les vrais tokens bruts
    const hashedRefreshToken = await this.hash(refreshToken);
    await this.userService.updateRefreshToken(id, hashedRefreshToken);

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

  clearCookie(name: string, response: Response): void {
    // Le path doit être identique à setCookie — sinon le navigateur
    // considère que c'est un cookie différent et ne l'efface pas
    response.clearCookie(name, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/auth',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: process.env.REFRESHSECRET,
      algorithms: process.env.JWTALGORITHM as any,
    });
    const user = await this.userService.findOne(payload.sub);
    if (!user?.refreshToken) throw new Error('Token révoqué');
    const isValid = await this.compare(token, user.refreshToken);
    if (!isValid) throw new Error('Token invalide');
    // Chercher le refresh token et compare token hasher et pas hasher
    return payload;
  }
  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode<JwtPayload>(token);
  }
}

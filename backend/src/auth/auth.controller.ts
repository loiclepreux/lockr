import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { User } from 'prisma/generated/prisma/client';
import { SigninDto } from './dto/signin.dto';
import type { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Créer un compte' })
  @ApiResponse({ status: 201, description: 'Compte créé avec succès' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @Post('signup')
  async signup(
    @Body() signupData: CreateUserDto,
  ): Promise<IResponse<Omit<User, 'password' | 'refreshToken'>>> {
    if (await this.userService.countByEmail(signupData.email)) {
      throw new ConflictException('Email déjà utilisé');
    }

    signupData.password = await this.authService.hash(signupData.password);

    const newUser = await this.userService.create(signupData);

    return {
      data: newUser,
      dataType: 'User',
      timeStamp: new Date(),
    };
  }

  @ApiOperation({ summary: 'Se connecter' })
  @ApiResponse({ status: 200, description: 'Connexion réussie, retourne un accessToken' })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects' })
  @Post('signin')
  async signin(
    @Body() loginData: SigninDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IResponse<{ accessToken: string }>> {
    const user = await this.userService.findByEmail(loginData.email);

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const isPasswordValid = await this.authService.compare(loginData.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const tokens = await this.authService.createTokens(user.id);

    this.authService.setCookie('refreshToken', tokens.refreshToken, response);

    return {
      data: { accessToken: tokens.accessToken },
      dataType: 'Auth',
      timeStamp: new Date(),
    };
  }

  @ApiOperation({ summary: 'Rafraîchir le token via cookie' })
  @ApiResponse({ status: 200, description: 'Nouveau accessToken généré' })
  @Get('refresh')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IResponse<{ accessToken: string }>> {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    let decodedToken;

    try {
      decodedToken = await this.authService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException();
    }

    const newTokens = await this.authService.createTokens(decodedToken.sub);

    this.authService.setCookie('refreshToken', newTokens.refreshToken, response);

    return {
      data: { accessToken: newTokens.accessToken },
      dataType: 'Auth',
      timeStamp: new Date(),
    };
  }

  @ApiOperation({ summary: 'Se déconnecter et révoquer le refresh token' })
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IResponse<null>> {
    const refreshToken = request.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = await this.authService.verifyRefreshToken(refreshToken);

        if (decoded?.sub) {
          await this.userService.updateRefreshToken(decoded.sub, null);
        }
      } catch {
        // Même si le token est invalide, on nettoie quand même le cookie côté navigateur
      }
    }

    this.authService.clearCookie('refreshToken', response);

    return {
      data: null,
      dataType: 'Auth',
      timeStamp: new Date(),
    };
  }
}

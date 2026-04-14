import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  PreconditionFailedException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { User } from 'prisma/generated/prisma/client';
import { SigninDto } from './dto/signin.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signup(@Body() signupData: CreateUserDto): Promise<IResponse<Omit<User, 'password'>>> {
    if (await this.userService.countByEmail(signupData.email)) {
      throw new ConflictException('Email déja utilisé');
    }

    signupData.password = await this.authService.hash(signupData.password);

    const newUser = await this.userService.create(signupData);

    return {
      data: newUser,
      dataType: 'User',
      timeStamp: new Date(),
    };
  }
  @Post('signin')
  async signin(
    @Body() loginData: SigninDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IResponse<{ accessToken: string }>> {
    const user = await this.userService.findByEmail(loginData.email);
    if (!user) {
      throw new PreconditionFailedException(' user or password incorect');
    }
    const isPasswordValid = await this.authService.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new PreconditionFailedException('user or password incorect');
    }
    const tokens = await this.authService.createTokens(user.id);
    this.authService.setCookie('refreshToken', tokens.refreshToken, response);
    return {
      data: { accessToken: tokens.accessToken },
      dataType: 'Auth',
      timeStamp: new Date(),
    };
  }
  @Get('refresh_token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IResponse<{ accessToken: string }>> {
    const refresh_token = request.cookies.refreshToken;
    if (!refresh_token) {
      throw new UnauthorizedException();
    }
    let decodedToken;
    // Vérifier la validité du token
    try {
      decodedToken = await this.authService.verifyRefreshToken(refresh_token);
    } catch {
      throw new UnauthorizedException();
    }
    // Créer de nouveaux tokens et mettre à jour le cookie
    const newTokens = await this.authService.createTokens(decodedToken.sub);
    this.authService.setCookie('refreshToken', newTokens.refreshToken, response);

    return {
      data: { accessToken: newTokens.accessToken },
      dataType: 'Auth',
      timeStamp: new Date(),
    };
  }
}
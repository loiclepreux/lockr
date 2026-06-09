import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Put,
  Patch,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'prisma/generated/prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { IResponse } from '../utils/interfaces/response.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterConfig } from 'src/config/config.multer';
import { UpdatePasswordDto } from './dto/update-password.dto';

type RequestWithUser = Request & { user: { sub: string } };

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll(): Promise<IResponse<Omit<User, 'password'>[]>> {
    // pagination a faire
    return {
      data: await this.userService.findAll(),
      dataType: 'User',
      timeStamp: new Date(),
    };
  }

  @Get('me')
  async getMe(@Req() req: RequestWithUser): Promise<IResponse<any>> {
    const userId = req.user.sub;

    const user = await this.userService.findMe(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      data: user,
      dataType: 'User',
      timeStamp: new Date(),
    };
  }

  @Post('me/photo')
  @UseInterceptors(
    FileInterceptor(
      'file',
      createMulterConfig({
        folder: 'profiles',
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
        maxSizeMb: 5,
      }),
    ),
  )
  async uploadMyPhoto(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse<any>> {
    const userId = req.user.sub;

    if (!file) {
      throw new HttpException('Aucun fichier reçu', HttpStatus.BAD_REQUEST);
    }

    return {
      data: await this.userService.updateProfilePhoto(userId, file),
      dataType: 'Profile',
      timeStamp: new Date(),
    };
  }

  // @UseGuards(AdminGuard)
  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<IResponse<Omit<User, 'password'>>> {
  //   const user = await this.userService.findOne(id);
  //   if (!user) {
  //     throw new NotFoundException('Utilisateur non trouvé');
  //   }
  //   return {
  //     data: user,
  //     dataType: 'User',
  //     timeStamp: new Date(),
  //   };
  // }

  @Put('me')
  async updateMe(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IResponse<any>> {
    const id = req.user.sub;

    const countUser = await this.userService.countById(id);

    if (!countUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (updateUserDto.email) {
      const userEmail = await this.userService.findEmailById(id);

      if (userEmail && userEmail.email !== updateUserDto.email) {
        const countByEmail = await this.userService.countByEmail(updateUserDto.email);

        if (countByEmail) {
          throw new HttpException('Email déjà utilisé', HttpStatus.PRECONDITION_FAILED);
        }
      }
    }

    return {
      data: await this.userService.update(id, updateUserDto),
      dataType: 'User',
      timeStamp: new Date(),
    };
  }

  @Patch('me/password')
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() data: UpdatePasswordDto,
  ): Promise<IResponse<null>> {
    await this.userService.changePassword(req.user.sub, data);

    return {
      data: null,
      dataType: 'Password',
      timeStamp: new Date(),
    };
  }

  @Delete('me')
  @HttpCode(204)
  async removeMe(@Req() req: RequestWithUser): Promise<void> {
    const id = req.user.sub;

    try {
      await this.userService.remove(id);
    } catch {
      throw new NotFoundException('Utilisateur non trouvé');
    }
  }
}

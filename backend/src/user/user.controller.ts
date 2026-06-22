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
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'prisma/generated/prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { IResponse } from '../utils/interfaces/response.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterConfig } from 'src/config/config.multer';
import { UpdatePasswordDto } from './dto/update-password.dto';
import type { RequestWithUser } from 'src/utils/interfaces/request-with-user.interface';

type UserSearchResult = {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    imgUrl: string | null;
  } | null;
};

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Lister tous les utilisateurs (pour la recherche de partage)' })
  @Get()
  async findAll(): Promise<IResponse<UserSearchResult[]>> {
    return {
      data: await this.userService.findAll(),
      dataType: 'User',
      timeStamp: new Date(),
    };
  }

  @ApiOperation({ summary: 'Mon profil complet' })
  @Get('me')
  async getMe(@Req() req: RequestWithUser): Promise<IResponse<any>> {
    const user = await this.userService.findMe(req.user.sub);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      data: user,
      dataType: 'User',
      timeStamp: new Date(),
    };
  }

  @ApiOperation({ summary: 'Uploader ma photo de profil' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Photo mise à jour' })
  @Post('me/photo')
  @UseInterceptors(
    FileInterceptor(
      'file',
      createMulterConfig({
        folder: 'profiles',
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
        allowedExtensions: ['.png', '.jpg', '.jpeg', '.webp'],
        maxSizeMb: 5,
      }),
    ),
  )
  async uploadMyPhoto(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse<any>> {
    if (!file) {
      throw new HttpException('Aucun fichier reçu', HttpStatus.BAD_REQUEST);
    }

    return {
      data: await this.userService.updateProfilePhoto(req.user.sub, file),
      dataType: 'Profile',
      timeStamp: new Date(),
    };
  }

  @ApiOperation({ summary: 'Mettre à jour mon profil' })
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

  @ApiOperation({ summary: 'Changer mon mot de passe' })
  @ApiResponse({ status: 400, description: 'Mot de passe actuel incorrect' })
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

  @ApiOperation({ summary: 'Supprimer mon compte' })
  @Delete('me')
  @HttpCode(204)
  async removeMe(@Req() req: RequestWithUser): Promise<void> {
    try {
      await this.userService.remove(req.user.sub);
    } catch {
      throw new NotFoundException('Utilisateur non trouvé');
    }
  }
}

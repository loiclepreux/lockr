import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'prisma/generated/prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            imgUrl: true,
          },
        },
      },
      take: 50,
      orderBy: {
        email: 'asc',
      },
    });
  }

  async countById(id: string): Promise<number> {
    return this.prisma.user.count({
      where: { id },
    });
  }

  async countByEmail(email: string): Promise<number> {
    return this.prisma.user.count({
      where: { email },
    });
  }

  async findOne(id: string): Promise<Omit<User, 'password'> | null> {
    const result = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    return result;
  }

  async findMe(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            imgUrl: true,
            phoneNumber: true,
            address: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findEmailById(id: string): Promise<Pick<User, 'email'> | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    const result = await this.prisma.user.update({
      where: { id },

      data: {
        ...(data.email && {
          email: data.email,
        }),

        profile: {
          update: {
            phoneNumber: data.phoneNumber,
            address: data.address,
          },
        },
      },

      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            imgUrl: true,
            phoneNumber: true,
            address: true,
          },
        },
      },
    });

    return result;
  }

  async updateProfilePhoto(userId: string, file: Express.Multer.File) {
    const imgUrl = `/uploads/profiles/${file.filename}`;

    return this.prisma.profile.update({
      where: {
        userId,
      },
      data: {
        imgUrl,
      },
      select: {
        firstName: true,
        lastName: true,
        imgUrl: true,
        phoneNumber: true,
        address: true,
      },
    });
  }

  async remove(id: string) {
    const result = await this.prisma.user.delete({
      where: { id },
    });
    return result;
  }

  async changePassword(userId: string, data: UpdatePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('Utilisateur introuvable', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Mot de passe actuel incorrect', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }
}

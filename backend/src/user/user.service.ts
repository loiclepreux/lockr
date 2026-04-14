import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'prisma/generated/prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<Omit<User, 'password'>> {

    const user = await this.prisma.user.create({
      data,
      omit: { password: true },
    });
    return user;
  }

  async findAll() {
    const result = await this.prisma.user.findMany({
      omit: { password: true },
    });
    return result;
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
  async findOne(id: string) : Promise<Omit<User, 'password'> | null> {
    const result = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    return result;
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

  async update(
    id: string,
    data: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const result = await this.prisma.user.update({
      where: { id },
      data,
      omit: { password: true },
    });
    return result;
  }

  async remove(id: string) {
    const result = await this.prisma.user.delete({
      where: { id },
    });
    return result;

  }
}

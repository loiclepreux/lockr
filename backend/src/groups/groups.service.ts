import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateGroupDto & { creatorId: string }): Promise<Group> {
  const group = await this.prisma.group.create({
    data,
  });
  
  return group; 
}

  async findAll() {
    const result = await this.prisma.group.findMany({});
    return result;
  }

  async findOne(id: string) : Promise<Group | null>{
    const result = await this.prisma.group.findUnique({
      where: { id },
    });
    return result;
  }

  async update(
    id: string,
    data: UpdateGroupDto,
  ): Promise<Group> {
    const result = await this.prisma.group.update({
      where: { id },
      data,
    });
    return result;
  }

  async remove(id: string, userId: any) {
    const group = await this.findOne(id);
    if(!group){
      throw new NotFoundException()
    }
    if (String(group.creatorId) !== String(userId)) {
      throw new ForbiddenException();
    }
    const result = await this.prisma.group.delete({
      where: { id },
    });
    return result;
  }
}

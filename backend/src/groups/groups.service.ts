import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Group } from './entities/group.entity';
import { GroupInclude } from 'prisma/generated/prisma/models';
import { addMemberDTO } from './dto/add-member.dto';

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
    const result = await this.prisma.group.findMany({
      include: {
        users: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
    return result;
  }

  async findOne(id: string): Promise<Group | null> {
    const result = await this.prisma.group.findUnique({
      where: { id },
    });
    return result;
  }

  async update(id: string, data: UpdateGroupDto): Promise<Group> {
    const result = await this.prisma.group.update({
      where: { id },
      data,
    });
    return result;
  }

  async remove(id: string, userId: any) {
    const group = await this.findOne(id);
    if (!group) {
      throw new NotFoundException();
    }
    if (String(group.creatorId) !== String(userId)) {
      throw new ForbiddenException();
    }
    const result = await this.prisma.group.delete({
      where: { id },
    });
    return result;
  }

  async addMember(groupId: string, addMemberDTO: addMemberDTO, adminId: string) {
    const group = await this.findOne(groupId);
    if (!group) {
      throw new NotFoundException();
    }
    if (String(group.creatorId) !== String(adminId)) {
      throw new ForbiddenException();
    }
    if (addMemberDTO.userId === adminId) {
      throw new BadRequestException('Vous êtes déjà dans ce groupe');
    }
    const userExist = await this.prisma.user.findUnique({
      where: {
        id: addMemberDTO.userId,
      },
    });
    if (!userExist) {
      throw new NotFoundException("L'utilisateur n'existe pas");
    }
    try {
      const result = await this.prisma.userInGroup.create({
        data: {
          groupId: groupId,
          userId: addMemberDTO.userId,
          role: addMemberDTO.role,
        },
      });
      return result;
    } catch {
      throw new ConflictException();
    }
  }
}

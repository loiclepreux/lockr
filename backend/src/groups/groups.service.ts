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
import { AddDocToGroupDto } from './dto/add-doc-to-group.dto';

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

  async addDocToGroup(groupId: string, dto: AddDocToGroupDto, userId: string) {
    // On vérifie que le groupe existe
    const group = await this.findOne(groupId);

    // Seul le créateur peut ajouter des documents au groupe
    const isCreator = String(group!.creatorId) === String(userId);

    if (!isCreator) {
      throw new ForbiddenException("Vous n'avez pas le droit d'ajouter un document à ce groupe");
    }

    // On vérifie que le document existe
    const doc = await this.prisma.doc.findUnique({
      where: { id: dto.docId },
    });
    if (!doc) {
      throw new NotFoundException('Le document est introuvable');
    }

    // On tente la création — si le document est déjà dans le groupe
    // Prisma lèvera une erreur d'unicité qu'on intercepte avec ConflictException
    try {
      return await this.prisma.docsInGroup.create({
        data: {
          groupId,
          docId: dto.docId,
          expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : undefined,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ce document est déjà dans ce groupe');
      }

      throw error;
    }
  }
}

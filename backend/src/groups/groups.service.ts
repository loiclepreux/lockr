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
import { Group, targetEnum } from 'prisma/generated/prisma/client';
import { addMemberDTO } from './dto/add-member.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { removeMemberDTO } from './dto/remove-member.dto';
import { AddDocToGroupDto } from './dto/add-doc-to-group.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class GroupsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly activityLogService: ActivityLogService,
  ) {}
  async create(data: CreateGroupDto & { creatorId: string }): Promise<Group> {
    const group = await this.prisma.group.create({
      data,
    });
    await this.activityLogService.create({
      userId: data.creatorId,
      groupId: group.id,
      actionType: targetEnum.CREATE_GROUP,
      targetType: 'GROUP',
      targetId: group.id,
      log: `Groupe "${group.name}" créé`,
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
    const member = await this.prisma.userInGroup.findMany({
      where: {
        groupId: id,
      },
    });
    await this.activityLogService.create({
      userId,
      groupId: group.id,
      actionType: targetEnum.DELETE_GROUP,
      targetType: 'GROUP',
      targetId: group.id,
      log: `Groupe "${group.name}" supprimé`,
    });

    const result = await this.prisma.group.delete({
      where: { id },
    });
    member.forEach((m) => {
      if (m.userId !== userId) {
        this.eventEmitter.emit(
          'notif.trigger',
          id,
          'deleteGroup',
          m.userId,
          `Le groupe ${group.name} a été supprimé`,
        );
      }
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
      await this.activityLogService.create({
        userId: adminId,
        groupId,
        actionType: targetEnum.ADD_USER_IN_GROUP,
        targetType: 'GROUP',
        targetId: groupId,
        log: `Utilisateur ajouté au groupe "${group.name}"`,
      });

      this.eventEmitter.emit(
        'notif.trigger',
        groupId,
        'addUserInGroup',
        addMemberDTO.userId,
        `Vous avez été ajouté au groupe ${group.name}`,
      );
      return result;
    } catch {
      throw new ConflictException();
    }
  }

  async removeMember(groupId: string, removeMemberDTO: removeMemberDTO, adminId: string) {
    const group = await this.findOne(groupId);
    if (!group) {
      throw new NotFoundException("Le groupe n'existe pas");
    }
    if (String(group.creatorId) !== String(adminId)) {
      throw new ForbiddenException('Seul le créateur peut retirer un membre');
    }
    const result = await this.prisma.userInGroup.deleteMany({
      where: {
        groupId: groupId,
        userId: removeMemberDTO.userId,
      },
    });

    if (result.count > 0) {
      this.eventEmitter.emit(
        'notif.trigger',
        groupId,
        'removeUserFromGroup',
        removeMemberDTO.userId,
        `Vous avez été retiré du groupe ${group.name}`,
      );
    } else {
      throw new NotFoundException("L'utilisateur n'était pas dans ce groupe");
    }
    await this.activityLogService.create({
      userId: adminId,
      groupId,
      actionType: targetEnum.REMOVE_USER_IN_GROUP,
      targetType: 'GROUP',
      targetId: groupId,
      log: `Utilisateur retiré du groupe "${group.name}"`,
    });

    return result;
  }

  async addDocToGroup(groupId: string, dto: AddDocToGroupDto, userId: string) {
    // On vérifie que le groupe existe
    const group = await this.findOne(groupId);

    if (!group) {
      throw new NotFoundException("Le groupe n'existe pas");
    }

    // Seul le créateur peut ajouter des documents au groupe
    const isCreator = String(group.creatorId) === String(userId);

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
      const result = await this.prisma.docsInGroup.create({
        data: {
          groupId,
          docId: dto.docId,
          expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : undefined,
        },
      });

      await this.activityLogService.create({
        userId,
        groupId,
        actionType: targetEnum.ADD_DOC_IN_GROUP,
        targetType: 'GROUP',
        targetId: groupId,
        log: `Document ajouté au groupe "${group.name}"`,
      });

      return result;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ce document est déjà dans ce groupe');
      }

      throw error;
    }
  }

  async removeDocFromGroup(groupId: string, docId: string, userId: string) {
    const group = await this.findOne(groupId);

    if (!group) {
      throw new NotFoundException("Le groupe n'existe pas");
    }

    const isCreator = String(group.creatorId) === String(userId);

    if (!isCreator) {
      throw new ForbiddenException("Vous n'avez pas le droit de retirer un document");
    }

    const relation = await this.prisma.docsInGroup.findFirst({
      where: {
        groupId,
        docId,
      },
    });

    if (!relation) {
      throw new NotFoundException("Ce document n'est pas dans ce groupe");
    }

    await this.prisma.docsInGroup.delete({
      where: {
        groupId_docId: {
          groupId,
          docId,
        },
      },
    });

    await this.activityLogService.create({
      userId,
      groupId,
      actionType: targetEnum.REMOVE_DOC_IN_GROUP,
      targetType: 'GROUP',
      targetId: groupId,
      log: `Document retiré du groupe "${group.name}"`,
    });

    return {
      success: true,
    };
  }

  async getGroupDocuments(groupId: string) {
    const group = await this.findOne(groupId);

    if (!group) {
      throw new NotFoundException("Le groupe n'existe pas");
    }

    return this.prisma.docsInGroup.findMany({
      where: {
        groupId,
      },
      include: {
        doc: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

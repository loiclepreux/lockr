import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import { PrismaService } from 'prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CreateShareDto } from './dto/create-share.dto';
import { DocStatus, DocPriority, targetEnum } from 'prisma/generated/prisma/client';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogService: ActivityLogService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // je transforme les BigInt en string pour éviter des erreurs JSON
  private TransformBigInt = (data: any) =>
    JSON.parse(JSON.stringify(data, (_, v) => (typeof v === 'bigint' ? v.toString() : v)));

  // je récupère un document ou j'envoie une erreur s'il n'existe pas
  private async getDocument(id: string) {
    const document = await this.prisma.doc.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!document) {
      throw new NotFoundException('Document introuvable');
    }

    return document;
  }

  // je vérifie que l'utilisateur est bien le propriétaire du document
  private Owner(document: any, userId: string) {
    if (document.ownerId !== userId) {
      throw new ForbiddenException('Action non autorisée');
    }
  }

  // création d'un document
  async create(
    data: CreateDocumentDto & {
      ownerId: string;
      filePath: string;
      size: string;
      name: string;
    },
  ) {
    const newDocument = await this.prisma.doc.create({
      data: {
        ...data,
        size: BigInt(data.size),
        addedDate: data.addedDate ? new Date(data.addedDate) : new Date(),
      },
    });
    await this.activityLogService.create({
      userId: data.ownerId,
      actionType: targetEnum.CREATE_DOCUMENT,
      targetType: 'DOCUMENT',
      targetId: newDocument.id,
      log: `Document "${newDocument.name}" créé`,
    });
    return this.TransformBigInt(newDocument);
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [documents, total] = await this.prisma.$transaction([
      this.prisma.doc.findMany({
        where: { ownerId: userId, deletedAt: null },
        include: { docType: true },
        orderBy: { addedDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.doc.count({ where: { ownerId: userId, deletedAt: null } }),
    ]);

    return this.TransformBigInt({
      data: documents,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  }

  // récupèration d'un document
  async findOne(id: string, userId: string) {
    const document = await this.prisma.doc.findFirst({
      where: {
        id,
        ownerId: userId,
        deletedAt: null,
      },
      include: {
        docType: true,
      },
    });

    if (!document) {
      throw new NotFoundException('Document introuvable');
    }

    return this.TransformBigInt(document);
  }

  // suppression d'un document
  async remove(id: string, userId: string) {
    const document = await this.getDocument(id);

    this.Owner(document, userId);

    const deletedDocument = await this.prisma.doc.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
      },
    });
    await this.activityLogService.create({
      userId,
      actionType: targetEnum.DELETE_DOCUMENT,
      targetType: 'DOCUMENT',
      targetId: id,
      log: `Document "${document.name}" supprimé`,
    });

    return this.TransformBigInt(deletedDocument);
  }

  // mise a jours du status d'un document
  async updateStatus(id: string, status: DocStatus, userId: string) {
    const document = await this.getDocument(id);
    this.Owner(document, userId);
    const updatedDocument = await this.prisma.doc.update({
      where: { id },
      data: { status },
    });

    await this.activityLogService.create({
      userId,
      actionType: targetEnum.UPDATE_DOCUMENT,
      targetType: 'DOCUMENT',
      targetId: id,
      log: `Statut du document "${document.name}" modifié vers ${status}`,
    });
    return this.TransformBigInt(updatedDocument);
  }

  // mise a jours de la priorité d'un document
  async updatePriority(id: string, priority: DocPriority, userId: string) {
    const document = await this.getDocument(id);

    this.Owner(document, userId);

    const updatedDocument = await this.prisma.doc.update({
      where: { id },
      data: { priority },
    });
    await this.activityLogService.create({
      userId,
      actionType: targetEnum.UPDATE_DOCUMENT,
      targetType: 'DOCUMENT',
      targetId: id,
      log: `Priorité du document "${document.name}" modifiée vers ${priority}`,
    });

    return this.TransformBigInt(updatedDocument);
  }

  // modification d'un document
  async update(id: string, data: UpdateDocumentDto, userId: string) {
    const document = await this.getDocument(id);
    this.Owner(document, userId);
    const updateData: any = {
      ...data,
    };
    if (data.addedDate) {
      updateData.addedDate = new Date(data.addedDate);
    }
    if (data.docTypeId) {
      updateData.docType = {
        connect: { id: data.docTypeId },
      };
      delete updateData.docTypeId;
    }

    const updatedDocument = await this.prisma.doc.update({
      where: { id },
      data: updateData,
    });
    await this.activityLogService.create({
      userId,
      actionType: targetEnum.UPDATE_DOCUMENT,
      targetType: 'DOCUMENT',
      targetId: id,
      log: `Document "${document.name}" modifié`,
    });
    return this.TransformBigInt(updatedDocument);
  }

  // partage d'un document avec d'autre users
  async shareDocument(documentId: string, createShareDto: CreateShareDto, requesterId: string) {
    const { receiverId, expirationDate } = createShareDto;
    const document = await this.getDocument(documentId);
    this.Owner(document, requesterId);
    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver) {
      throw new NotFoundException('le destinataire est introuvable');
    }

    const existShare = await this.prisma.sharedDoc.findUnique({
      where: {
        docId_receiverId: {
          docId: documentId,
          receiverId: receiverId,
        },
      },
    });
    if (existShare) {
      throw new BadRequestException('Ce document est déjà partagé avec cet utilisateur');
    }

    const newShare = await this.prisma.sharedDoc.create({
      data: {
        doc: {
          connect: { id: documentId },
        },
        receiver: {
          connect: { id: receiverId },
        },
        expirationDate: expirationDate ? new Date(expirationDate) : null,
      },
    });

    await this.activityLogService.create({
      userId: requesterId,
      actionType: targetEnum.SHARE_DOCUMENT,
      targetType: 'DOCUMENT',
      targetId: documentId,
      log: `Document "${document.name}" partagé avec ${receiver.email}`,
    });

    this.eventEmitter.emit('notif.trigger', {
      relatedId: documentId,
      relatedType: 'DOCUMENT_SHARE',
      userId: receiverId,
      message: `Le document "${document.name}" vous a été partagé`,
    });
    return newShare;
  }

  // recupération d'un partage de document
  async findSharedWithMe(userId: string) {
    const sharedDocuments = await this.prisma.sharedDoc.findMany({
      where: {
        receiverId: userId,
        OR: [{ expirationDate: null }, { expirationDate: { gt: new Date() } }],
        doc: {
          deletedAt: null,
        },
      },
      include: {
        doc: {
          include: {
            docType: true,
          },
        },
      },
    });

    return this.TransformBigInt(sharedDocuments);
  }

  // suppression d'un partage de document
  async revokeShare(documentId: string, receiverId: string, userId: string) {
    const document = await this.getDocument(documentId);

    this.Owner(document, userId);

    const existingShare = await this.prisma.sharedDoc.findUnique({
      where: {
        docId_receiverId: {
          docId: documentId,
          receiverId,
        },
      },
    });

    if (!existingShare) {
      throw new NotFoundException('Partage introuvable');
    }
    await this.activityLogService.create({
      userId,
      actionType: targetEnum.REVOKE_SHARE,
      targetType: 'DOCUMENT',
      targetId: documentId,
      log: `Partage du document "${document.name}" révoqué`,
    });

    return this.prisma.sharedDoc.delete({
      where: {
        docId_receiverId: {
          docId: documentId,
          receiverId,
        },
      },
    });
  }

  async findTrash(userId: string) {
    const documents = await this.prisma.doc.findMany({
      where: {
        ownerId: userId,
        deletedAt: {
          not: null,
        },
      },
      include: {
        docType: true,
      },
      orderBy: {
        deletedAt: 'desc',
      },
    });

    return this.TransformBigInt(documents);
  }

  async restore(id: string, userId: string) {
    const document = await this.prisma.doc.findFirst({
      where: {
        id,
        ownerId: userId,
        deletedAt: {
          not: null,
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document introuvable dans la corbeille');
    }

    const restoredDocument = await this.prisma.doc.update({
      where: { id },
      data: {
        deletedAt: null,
        status: DocStatus.ACTIVE,
      },
    });

    await this.activityLogService.create({
      userId,
      actionType: targetEnum.RESTORE_DOCUMENT,
      targetType: 'DOCUMENT',
      targetId: id,
      log: `Document "${document.name}" restauré`,
    });

    return this.TransformBigInt(restoredDocument);
  }

  async permanentDelete(id: string, userId: string) {
    const document = await this.prisma.doc.findFirst({
      where: {
        id,
        ownerId: userId,
        deletedAt: {
          not: null,
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document introuvable dans la corbeille');
    }

    await this.activityLogService.create({
      userId,
      actionType: targetEnum.PERMANENT_DELETE_DOCUMENT,
      targetType: 'DOCUMENT',
      targetId: id,
      log: `Document "${document.name}" supprimé définitivement`,
    });

    const deletedDocument = await this.prisma.doc.delete({
      where: { id },
    });

    return this.TransformBigInt(deletedDocument);
  }

  async download(id: string, userId: string, res: Response) {
    const document = await this.prisma.doc.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!document) {
      throw new NotFoundException('Document introuvable');
    }

    const isOwner = document.ownerId === userId;

    const validShare = await this.prisma.sharedDoc.findFirst({
      where: {
        docId: id,
        receiverId: userId,
        OR: [{ expirationDate: null }, { expirationDate: { gt: new Date() } }],
      },
    });

    if (!isOwner && !validShare) {
      throw new ForbiddenException('Accès refusé');
    }

    if (!fs.existsSync(document.filePath)) {
      throw new NotFoundException('Fichier introuvable sur le serveur');
    }

    return res.download(document.filePath, document.name);
  }
}

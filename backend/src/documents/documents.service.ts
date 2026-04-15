import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CreateShareDto } from './dto/create-share.dto';
import { DocStatus } from 'prisma/generated/prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  private serializeBigInt<T>(data: T): T {
    return JSON.parse(
      JSON.stringify(data, (_, value) => (typeof value === 'bigint' ? value.toString() : value)),
    );
  }

  async create(
    data: CreateDocumentDto & {
      ownerId: string;
      filePath: string;
      size: string;
      name: string;
    },
  ) {
    const document = await this.prisma.doc.create({
      data: {
        ...data,
        size: BigInt(data.size),
        addedDate: data.addedDate ? new Date(data.addedDate) : new Date(),
      },
    });

    return this.serializeBigInt(document);
  }

  async findAll() {
    const documents = await this.prisma.doc.findMany({
      include: {
        owner: true,
        docType: true,
      },
    });

    return this.serializeBigInt(document);
  }

  async findOne(id: string) {
    const document = await this.prisma.doc.findUnique({
      where: { id },
      include: {
        owner: true,
        docType: true,
      },
    });

    if (!document) {
      throw new NotFoundException('Document introuvable');
    }

    return this.serializeBigInt(document);
  }

  async update(id: string, data: UpdateDocumentDto, userId: string) {
    const document = await this.prisma.doc.findUnique({ where: { id } });

    if (!document) {
      throw new NotFoundException('Document introuvable');
    }

    if (document.ownerId !== userId) {
      throw new ForbiddenException('Modification non autorisée');
    }

    const { addedDate, docTypeId, ...rest } = data;

    const updatedDocument = await this.prisma.doc.update({
      where: { id },
      data: {
        ...rest,
        ...(addedDate ? { addedDate: new Date(addedDate) } : {}),
        ...(docTypeId
          ? {
              docType: {
                connect: { id: docTypeId },
              },
            }
          : {}),
      },
    });

    return this.serializeBigInt(document);
  }

  async remove(id: string, userId: string) {
    const document = await this.prisma.doc.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document introuvable');
    }

    if (document.ownerId !== userId) {
      throw new ForbiddenException('Tu ne peux pas supprimer ce document');
    }

    return this.prisma.doc.delete({
      where: { id },
    });
  }

  async shareDocument(documentId: string, createShareDto: CreateShareDto, requesterId: string) {
    const { receiverId, expirationDate } = createShareDto;

    const document = await this.prisma.doc.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document introuvable');
    }

    if (document.ownerId !== requesterId) {
      throw new ForbiddenException('Seul le propriétaire peut partager ce document');
    }

    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new NotFoundException('Utilisateur destinataire introuvable');
    }

    const existingShare = await this.prisma.sharedDoc.findUnique({
      where: {
        docId_receiverId: {
          docId: documentId,
          receiverId,
        },
      },
    });

    if (existingShare) {
      throw new BadRequestException('Ce document est déjà partagé avec cet utilisateur');
    }

    const share = await this.prisma.sharedDoc.create({
      data: {
        doc: {
          connect: { id: documentId },
        },
        receiver: {
          connect: { id: receiverId },
        },
        ...(expirationDate ? { expirationDate: new Date(expirationDate) } : {}),
      },
    });

    return this.serializeBigInt(share);
  }

  async updateStatus(id: string, status: DocStatus, userId: string) {
    const document = await this.prisma.doc.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document introuvable');
    }

    if (document.ownerId !== userId) {
      throw new ForbiddenException('Modification non autorisée');
    }

    const updated = await this.prisma.doc.update({
      where: { id },
      data: { status },
    });

    return this.serializeBigInt(updated);
  }
}

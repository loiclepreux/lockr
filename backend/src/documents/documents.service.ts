import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CreateShareDto } from './dto/create-share.dto';
import { DocStatus } from 'prisma/generated/prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  // je transforme les BigInt en string pour éviter des erreurs JSON
  private TransformBigInt = (data: any) =>
    JSON.parse(
      JSON.stringify(data, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
    );

  // je récupère un document ou j'envoie une erreur s'il n'existe pas
  private async getDocument(id: string) {
    const document = await this.prisma.doc.findUnique({
      where: { id },
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
        status: DocStatus.ACTIVE,
        addedDate: data.addedDate ? new Date(data.addedDate) : new Date(),
      },
    });
    return this.TransformBigInt(newDocument);
  }

  // récupèration de tout les documents
  async findAll() {
    const documents = await this.prisma.doc.findMany({
      include: {
        owner: true,
        docType: true,
      },
    });
    return this.TransformBigInt(documents);
  }

  // récupèration d'un document
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
    return this.TransformBigInt(document);
  }

  // suppression d'un document
  async remove(id: string, userId: string) {
    const document = await this.getDocument(id);
    this.Owner(document, userId);
    const deletedDocument = await this.prisma.doc.delete({
      where: { id },
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
    return (newShare);
  }
}
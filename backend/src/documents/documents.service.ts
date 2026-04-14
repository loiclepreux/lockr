import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDocumentDto & { ownerId: string }) {
    return this.prisma.doc.create({
      data: {
        ...data,
        size: BigInt(data.size),
        addedDate: new Date(data.addedDate),
      },
    });
  }

  async findAll() {
    return this.prisma.doc.findMany({
      include: {
        owner: true,
        docType: true,
      },
    });
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

    return document;
  }

  async update(id: string, data: UpdateDocumentDto, userId: string) {
    const document = await this.prisma.doc.findUnique({ where: { id } });

    if (!document) {
      throw new NotFoundException('Document introuvable');
    }

    if (document.ownerId !== userId) {
      throw new ForbiddenException('Modification non autorisée');
    }

    const { size, addedDate, docTypeId, ...rest } = data;

    return this.prisma.doc.update({
      where: { id },
      data: {
        ...rest,
        ...(size ? { size: BigInt(size) } : {}),
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
}

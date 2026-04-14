import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateDocumentDto & { creatorId: string }): Promise<Document> {
  const document = await this.prisma.document.create({
    data,
  });
  
  return document; 
}

  async findAll() {
    const result = await this.prisma.document.findMany({});
    return result;
  }

  async findOne(id: string) : Promise<Document | null>{
    const result = await this.prisma.document.findUnique({
      where: { id },
    });
    return result;
  }

  async update(
    id: string,
    data: UpdateDocumentDto,
  ): Promise<Document> {
    const result = await this.prisma.document.update({
      where: { id },
      data,
    });
    return result;
  }

  async remove(id: string, userId: any) {
    const document = await this.findOne(id);
    if(!document){
      throw new NotFoundException()
    }
    if (String(document.creatorId) !== String(userId)) {
      throw new ForbiddenException();
    }
    const result = await this.prisma.document.delete({
      where: { id },
    });
    return result;
  }
}

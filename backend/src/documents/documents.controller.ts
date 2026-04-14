import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UnauthorizedException } from '@nestjs/common';

interface AuthenticatedRequest extends Request {
  user: {
    id?: string;
    sub?: string;
  };
}

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createDocumentDto: CreateDocumentDto, @Req() req: AuthenticatedRequest) {
    const ownerId = req.user?.id || req.user?.sub;

    if (!ownerId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    return this.documentsService.create({
      ...createDocumentDto,
      ownerId,
    });
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id ?? req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
    return this.documentsService.update(id, updateDocumentDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.id ?? req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    return this.documentsService.remove(id, userId);
  }
}

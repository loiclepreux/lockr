import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CreateShareDto } from './dto/create-share.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateDocumentStatusDto } from './dto/status-document.dto';

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
  @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const ownerId = req.user?.id ?? req.user?.sub;

    if (!ownerId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    if (!file) {
      throw new BadRequestException('Aucun fichier envoyé');
    }

    return this.documentsService.create({
      ...createDocumentDto,
      ownerId,
      filePath: file.path,
      size: file.size.toString(),
      name: createDocumentDto.name || file.originalname,
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

  @Post(':id/share')
  @UseGuards(AuthGuard)
  shareDocument(
    @Param('id') documentId: string,
    @Body() createShareDto: CreateShareDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id ?? req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    return this.documentsService.shareDocument(documentId, createShareDto, userId);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id ?? req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    return this.documentsService.updateStatus(id, dto.status, userId);
  }
}

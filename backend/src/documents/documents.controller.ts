import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CreateShareDto } from './dto/create-share.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateDocumentStatusDto } from './dto/status-document.dto';

interface AuthentifRequest extends Request {
  user: {
    id?: string;
    sub?: string;
  };
}

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // je récupère l'id de l'utilisateur connecté
  private getUserId(req: AuthentifRequest): string {
    const userId = req.user?.id || req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
    return userId;
  }

  // j'upload un document et l'associe a l'utilisateur authentifié
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @Req() req: AuthentifRequest,
  ) {
    const userId = this.getUserId(req);

    if (!file) {
      throw new BadRequestException('Aucun fichier envoyé');
    }

    return this.documentsService.create({
      ...createDocumentDto,
      ownerId: userId,
      filePath: file.path,
      size: file.size.toString(),
      name: createDocumentDto.name ? createDocumentDto.name : file.originalname,
    });
  }

  // je recupére tous les documents de la bdd
  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  // je recupére un doucment de la bdd
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

// je supprime un document existant
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: AuthentifRequest) {
    const userId = this.getUserId(req);
    return this.documentsService.remove(id, userId);
  }

  // je mets a jours un document existant
  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Req() req: AuthentifRequest,
  ) {
    const userId = this.getUserId(req);
    return this.documentsService.update(id, updateDocumentDto, userId);
  }

  // je partage un document avec d'autre users
  @Post(':id/share')
  @UseGuards(AuthGuard)
  shareDocument(
    @Param('id') documentId: string,
    @Body() createShareDto: CreateShareDto,
    @Req() req: AuthentifRequest,
  ) {
    const userId = this.getUserId(req);
    return this.documentsService.shareDocument(documentId, createShareDto, userId);
  }

  // je mets a jours le status d'un document
  @Patch(':id/status')
  @UseGuards(AuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateDocumentStatusDto,
    @Req() req: AuthentifRequest,
  ) {
    const userId = this.getUserId(req);
    return this.documentsService.updateStatus(id, updateStatusDto.status, userId);
  }
}
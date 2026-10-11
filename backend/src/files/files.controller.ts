import { Controller, Get, NotFoundException, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { FilesService } from './files.service';

// Images publiques (photos de profil, images de groupe).
// Les documents, eux, ne passent JAMAIS par ici : ils se téléchargent via
// /documents/:id/download, qui vérifie le propriétaire et les partages.
@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: "Afficher une image publique (photo de profil, groupe)" })
  @Get(':id')
  async show(@Param('id', new ParseUUIDPipe()) id: string, @Res() res: Response) {
    const file = await this.filesService.get(id);
    if (file.kind === 'documents') {
      throw new NotFoundException('Fichier introuvable');
    }
    res.set({
      'Content-Type': file.mimeType,
      'Content-Length': String(file.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
    });
    res.send(file.data);
  }
}

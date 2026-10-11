import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'prisma/prisma.service';

export type StoredFileKind = 'documents' | 'profiles' | 'groups';

export interface StoredFileData {
  id: string;
  kind: StoredFileKind;
  mimeType: string;
  size: number;
  data: Buffer;
}

// Les fichiers envoyés sont rangés dans la base (table StoredFile) et non sur le disque :
// l'hébergeur gratuit (Render) efface son disque à chaque redémarrage.
// Requêtes SQL directes : plus simple et plus léger pour de gros contenus binaires.
@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  // Enregistre un fichier et renvoie la référence à garder en base ("db:<id>")
  async save(file: Express.Multer.File, kind: StoredFileKind): Promise<string> {
    const id = randomUUID();
    await this.prisma.$executeRaw`
      INSERT INTO StoredFile (id, kind, mimeType, size, data)
      VALUES (${id}, ${kind}, ${file.mimetype}, ${file.size}, ${file.buffer})
    `;
    return `db:${id}`;
  }

  async get(ref: string): Promise<StoredFileData> {
    const id = FilesService.idFromRef(ref);
    const rows = await this.prisma.$queryRaw<StoredFileData[]>`
      SELECT id, kind, mimeType, size, data FROM StoredFile WHERE id = ${id} LIMIT 1
    `;
    if (!rows.length) {
      throw new NotFoundException('Fichier introuvable');
    }
    const row = rows[0];
    return { ...row, size: Number(row.size), data: Buffer.from(row.data) };
  }

  async remove(ref: string | null | undefined): Promise<void> {
    if (!ref || !FilesService.isStored(ref)) return;
    const id = FilesService.idFromRef(ref);
    await this.prisma.$executeRaw`DELETE FROM StoredFile WHERE id = ${id}`;
  }

  // "db:<id>" pour un document, "/files/<id>" pour une image publique
  static isStored(ref: string): boolean {
    return ref.startsWith('db:') || ref.startsWith('/files/');
  }

  static idFromRef(ref: string): string {
    return ref.replace(/^db:/, '').replace(/^\/files\//, '');
  }
}

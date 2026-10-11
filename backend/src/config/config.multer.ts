import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { UploadFolder } from 'src/utils/UploadFolder';

type MulterConfigParams = {
  folder?: UploadFolder; // type de fichier (pour la lisibilité)
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  maxSizeMb?: number;
};

export const createMulterConfig = ({
  allowedMimeTypes = [],
  allowedExtensions = [],
  maxSizeMb = 10,
}: MulterConfigParams): MulterOptions => ({
  // Le fichier reste en mémoire : il est ensuite rangé dans la base (voir FilesService)
  storage: memoryStorage(),

  fileFilter: (req, file, cb) => {
    const extension = extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.mimetype)) {
      return cb(new BadRequestException(`Type MIME non autorisé : ${file.mimetype}`), false);
    }

    if (allowedExtensions.length > 0 && !allowedExtensions.includes(extension)) {
      return cb(new BadRequestException(`Extension non autorisée : ${extension}`), false);
    }

    cb(null, true);
  },

  limits: {
    fileSize: maxSizeMb * 1024 * 1024,
  },
});

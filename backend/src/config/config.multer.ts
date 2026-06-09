import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { UploadFolder } from 'src/utils/UploadFolder';

type MulterConfigParams = {
  folder: UploadFolder;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  maxSizeMb?: number;
};

export const createMulterConfig = ({
  folder,
  allowedMimeTypes = [],
  allowedExtensions = [],
  maxSizeMb = 10,
}: MulterConfigParams): MulterOptions => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = `./uploads/${folder}`;

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const timestamp = Date.now();

      const extension = extname(file.originalname).toLowerCase();

      const originalName = file.originalname
        .replace(extension, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9._-]/g, '');

      const safeBaseName = originalName || 'file';

      const uniqueName = `${timestamp}-${safeBaseName}${extension}`;

      cb(null, uniqueName);
    },
  }),

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

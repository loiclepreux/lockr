import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { UploadFolder } from 'src/utils/UploadFolder';
import { BadRequestException } from '@nestjs/common';

type MulterConfigParams = {
  folder: UploadFolder;
  allowedMimeTypes?: string[];
  maxSizeMb?: number;
};

export const createMulterConfig = ({
  folder,
  allowedMimeTypes = [],
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
      const originalName = file.originalname.replace(/\s+/g, '-');
      const extension = extname(originalName);
      const baseName = originalName.replace(extension, '');
      const uniqueName = `${timestamp}-${baseName}${extension}`;

      cb(null, uniqueName);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.mimetype)) {
      return cb(new BadRequestException(`Type de fichier non autorisé : ${file.mimetype}`), false);
    }

    cb(null, true);
  },

  limits: {
    fileSize: maxSizeMb * 1024 * 1024,
  },
});

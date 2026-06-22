import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';

const isDev = process.env.NODE_ENV !== 'production';

export const winstonConfig: winston.LoggerOptions = {
  transports: [
    // Console — format lisible en développement, JSON compact en production
    new winston.transports.Console({
      format: isDev
        ? winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('Lockr', { prettyPrint: true }),
          )
        : winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    // Fichier d'erreurs persistant
    new winston.transports.File({
      filename: join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    }),
    // Fichier de logs complet
    new winston.transports.File({
      filename: join(process.cwd(), 'logs', 'combined.log'),
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      maxsize: 20 * 1024 * 1024, // 20 MB
      maxFiles: 10,
    }),
  ],
};

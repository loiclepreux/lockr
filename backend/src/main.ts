import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';
import { existsSync } from 'fs';
import type { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Toutes les routes de l'API commencent par /api (le reste est pour le site React)
  app.setGlobalPrefix('api');

  // En ligne (Render), l'appli est derrière un proxy : on lit la vraie adresse IP du visiteur
  // (indispensable pour la limite de requêtes par IP)
  app.set('trust proxy', 1);

  app.use(cookieParser());

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  const allowedOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''));

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Anciennes photos rangées sur le disque (avant le stockage en base)
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/api/uploads/',
  });

  // Le site React construit (frontend/dist) est servi par le même serveur :
  // même adresse pour le site et l'API, donc le cookie de connexion fonctionne partout.
  const frontDist = process.env.FRONT_DIST ?? join(process.cwd(), '..', 'frontend', 'dist');
  if (existsSync(join(frontDist, 'index.html'))) {
    app.useStaticAssets(frontDist, { index: false, maxAge: '7d' });
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.setHeader('Cache-Control', 'no-cache');
        return res.sendFile(join(frontDist, 'index.html'));
      }
      next();
    });
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Lockr API')
    .setDescription('API de gestion et partage de documents sécurisée')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

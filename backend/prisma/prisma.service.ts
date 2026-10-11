import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Réglages des connexions à la base.
// L'hébergeur MySQL (Hostinger) limite le nombre de connexions ouvertes par heure.
// Par défaut, le pilote garde 10 connexions ouvertes en permanence et les recrée
// dès que le serveur MySQL les ferme : la limite est vite dépassée.
// Ici : 3 connexions maximum (1 seule gardée ouverte quand le site est calme),
// les autres sont refermées après 20 secondes sans requête.
function poolConfig(databaseUrl: string) {
  const url = new URL(databaseUrl);
  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    connectionLimit: Number(process.env.DB_POOL_LIMIT ?? 3),
    minimumIdle: 1,
    idleTimeout: 20,
    acquireTimeout: 15000,
  };
}

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaMariaDb(poolConfig(process.env.DATABASE_URL as string));

    super({ adapter });
  }
}

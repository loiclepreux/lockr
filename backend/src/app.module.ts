import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.modules';
import { GroupsModule } from './groups/groups.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    GroupsModule,
    DocumentsModule,
  ],
})
export class AppModule {}

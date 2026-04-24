import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.modules';
import { GroupsModule } from './groups/groups.module';
import { ActivtyLogModule } from './activity-log/activity-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    GroupsModule,
    ActivtyLogModule,
  ],
})
export class AppModule {}

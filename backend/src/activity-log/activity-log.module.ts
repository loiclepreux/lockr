import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from '../auth/auth.modules';
import { ActivtyLogService } from './activity-log.service';
import { ActivtyLogController } from './activity-log.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ActivtyLogController],
  providers: [ActivtyLogService],
})
export class ActivtyLogModule {}

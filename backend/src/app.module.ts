import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.modules';
import { GroupsModule } from './groups/groups.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AccessRequestsModule } from './access-requests/access-requests.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging-interceptor';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    GroupsModule,
    DocumentsModule,
    NotificationsModule,
    EventEmitterModule.forRoot(),
    ActivityLogModule,
    DashboardModule,
    AccessRequestsModule,
    AuditLogModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { AuditLogService } from 'src/audit-log/audit-log.service';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const method = request.method;
    const url = request.originalUrl;

    const userId = request.user?.sub || request.user?.id || 'anonymous';

    return next.handle().pipe(
      tap(async () => {
        const duration = Date.now() - now;

        const status = response.statusCode;

        this.logger.log(`${method} ${url} | User=${userId} | Status=${status} | ${duration}ms`);

        try {
          await this.auditLogService.create({
            method,
            url,
            status,
            userId: userId !== 'anonymous' ? userId : undefined,
            duration,
            ip: request.ip,
            userAgent: request.headers['user-agent'],
          });
        } catch (error) {
          this.logger.error(
            'Failed to save audit log',
            error instanceof Error ? error.stack : String(error),
          );
        }
      }),
    );
  }
}

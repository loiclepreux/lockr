import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import type { RequestWithUser } from 'src/utils/interfaces/request-with-user.interface';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Récupérer toutes mes notifications' })
  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.notificationsService.findAllByUser(req.user.sub);
  }

  @ApiOperation({ summary: 'Compter les notifications non lues' })
  @Get('count')
  countUnread(@Req() req: RequestWithUser) {
    return this.notificationsService.countUnread(req.user.sub);
  }

  @ApiOperation({ summary: 'Marquer toutes les notifications comme lues' })
  @ApiResponse({ status: 200, description: 'Toutes les notifications sont marquées comme lues' })
  @Patch('read-all')
  readAll(@Req() req: RequestWithUser) {
    return this.notificationsService.markAllAsRead(req.user.sub);
  }

  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  @Patch(':notificationId/read')
  markAsRead(@Param('notificationId') notificationId: string, @Req() req: RequestWithUser) {
    return this.notificationsService.markAsRead(notificationId, req.user.sub);
  }
}

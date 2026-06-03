import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user['sub'];

    return this.notificationsService.findAllByUser(userId);
  }

  @Get('count')
  countUnread(@Req() req: any) {
    const userId = req.user['sub'];

    return this.notificationsService.countUnread(userId);
  }

  @Patch('read-all')
  readAll(@Req() req: any) {
    const userId = req.user['sub'];

    return this.notificationsService.markAllAsRead(userId);
  }

  @Patch(':notificationId/read')
  markAsRead(@Param('notificationId') notificationId: string, @Req() req: any) {
    const userId = req.user['sub'];

    return this.notificationsService.markAsRead(notificationId, userId);
  }
}

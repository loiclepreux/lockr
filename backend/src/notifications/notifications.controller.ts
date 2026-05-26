import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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

  @Post('test-event')
  testEvent(@Body() body: { userId: string }) {
    this.eventEmitter.emit(
      'notif.trigger',
      '1',
      'TEST',
      body.userId,
      'Ceci est un test de notification !',
    );

    return { message: 'Événement émis !' };
  }
}

import { Controller, Get, Patch, Param, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post('test-event')
  testEvent(@Body() body: { userId: string }) {
    this.eventEmitter.emit(
      'notif.trigger', 
      1,     
      'TEST',    
      body.userId, 
      'Ceci est un test de notification !'
    );
    return { message: 'Événement émis !' };
  }

  @Get(':userId/count')
  countUnread(@Param('userId') userId: string){
    return this.notificationsService.countUnread(userId)
  }
  
  @Patch(':userId/read-all')
  readAll(@Param('userId') userId: string){
    return this.notificationsService.markAllAsRead(userId)
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.notificationsService.findAllByUser(userId);
  }

  @Patch(':notificationId/:userId/read')
  markAsRead(
    @Param('notificationId') notificationId: string,
    @Param('userId') userId: string,
  ) {
    return this.notificationsService.markAsRead(notificationId, userId);
  }
}
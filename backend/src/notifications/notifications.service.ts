import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class NotificationsService {

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('notif.trigger')
  async listener(relatedId: string, relatedType: string, userId: string, message: string) {
      try {
      await this.prisma.$transaction(async (tx) => {
        const newNotif = await tx.notification.create({
          data: {
            message,
            relatedId,
            relatedType,
            type: relatedType,
          },
        });

        await tx.notificationToUser.create({
          data: {
            notificationId: newNotif.id,
            userId: userId,
          },
        });
      });
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }
  }

  findAllByUser(userId: string) {
    return this.prisma.notificationToUser.findMany({ 
      where: {
        userId: userId
      },
      include: {
        notification: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })  
  }

  markAsRead(notificationId: string, userId: string) {
    return this.prisma.notificationToUser.update({
      where: {
        notificationId_userId: {
          notificationId: notificationId,
          userId: userId,
        },
      },
      data: {
        isRead: true,
      },
    });
  }

  findAllMyNotif(userId: string){
    return this.prisma.notificationToUser.findMany({
      where: {
        userId: userId
      },
      include: {
        notification: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  countUnread(userId: string){
    return this.prisma.notificationToUser.count({
      where: {
        userId: userId,
        isRead: false
      }
    })
  }

  markAllAsRead(userId: string){
    return this.prisma.notificationToUser.updateMany({
      where: {
        userId: userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    })
  }
}
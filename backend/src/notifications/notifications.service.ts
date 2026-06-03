import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'prisma/prisma.service';

type NotificationPayload = {
  relatedId: string;
  relatedType: string;
  userId: string;
  message: string;
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('notif.trigger')
  async listener(payload: NotificationPayload) {
    const { relatedId, relatedType, userId, message } = payload;

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
            userId,
          },
        });
      });
    } catch (error) {
      this.logger.error(
        'Erreur lors de la création de la notification',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  findAllByUser(userId: string) {
    return this.prisma.notificationToUser.findMany({
      where: {
        userId: userId,
      },
      include: {
        notification: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notificationToUser.findUnique({
      where: {
        notificationId_userId: {
          notificationId,
          userId,
        },
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification introuvable');
    }

    return this.prisma.notificationToUser.update({
      where: {
        notificationId_userId: {
          notificationId,
          userId,
        },
      },
      data: {
        isRead: true,
      },
    });
  }

  countUnread(userId: string) {
    return this.prisma.notificationToUser.count({
      where: {
        userId: userId,
        isRead: false,
      },
    });
  }

  markAllAsRead(userId: string) {
    return this.prisma.notificationToUser.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}

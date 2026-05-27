import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(userId: string) {
    const [
      totalDocuments,
      totalGroups,
      totalSharedDocuments,
      unreadNotifications,
      recentActivitiesCount,
    ] = await Promise.all([
      this.prisma.doc.count({
        where: { ownerId: userId },
      }),

      this.prisma.userInGroup.count({
        where: { userId },
      }),

      this.prisma.sharedDoc.count({
        where: {
          receiverId: userId,
        },
      }),

      this.prisma.notificationToUser.count({
        where: {
          userId,
          isRead: false,
        },
      }),

      this.prisma.activityLog.count({
        where: { userId },
      }),
    ]);

    return {
      totalDocuments,
      totalGroups,
      totalSharedDocuments,
      unreadNotifications,
      recentActivitiesCount,
    };
  }
}

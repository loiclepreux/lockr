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
        where: {
          ownerId: userId,
          deletedAt: null,
        },
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

  async getMonthlyImports(userId: string) {
    const documents = await this.prisma.doc.findMany({
      where: {
        ownerId: userId,
        deletedAt: null,
      },
      select: {
        addedDate: true,
      },
    });

    const months = [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Juin',
      'Juil',
      'Août',
      'Sep',
      'Oct',
      'Nov',
      'Déc',
    ];

    const result = months.map((month) => ({
      month,
      imports: 0,
    }));

    documents.forEach((doc) => {
      const monthIndex = new Date(doc.addedDate).getMonth();
      result[monthIndex].imports += 1;
    });

    return result;
  }

  async getDocumentsByType(userId: string) {
    const documents = await this.prisma.doc.findMany({
      where: {
        ownerId: userId,
        deletedAt: null,
      },
      select: {
        extension: true,
      },
    });

    const stats = new Map<string, number>();

    documents.forEach((doc) => {
      const ext = doc.extension.toUpperCase();

      stats.set(ext, (stats.get(ext) ?? 0) + 1);
    });

    return Array.from(stats.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }
}

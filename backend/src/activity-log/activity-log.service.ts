import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GetHistoryDto } from './dto/get-history.dto';
import { PaginatedResponse } from 'src/utils/interfaces/paginated-response.interface';
import { ActivityLog, targetEnum } from 'prisma/generated/prisma/client';

@Injectable()
export class ActivityLogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: GetHistoryDto): Promise<PaginatedResponse<ActivityLog>> {
    const page = Math.max(1, parseInt(dto.page ?? '1', 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(dto.limit ?? '10', 10) || 10));
    const skip = (page - 1) * limit;

    const where = {
      ...(dto.groupId && { groupId: dto.groupId }),
      ...(dto.actionType && { actionType: dto.actionType }),
      ...(dto.startDate || dto.endDate
        ? {
            createdAt: {
              ...(dto.startDate && { gte: new Date(dto.startDate) }),
              ...(dto.endDate && { lte: new Date(dto.endDate) }),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findRecentByUser(userId: string) {
    return this.prisma.activityLog.findMany({
      where: {
        userId,
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async create(data: {
    userId: string;
    groupId?: string | null;
    actionType: targetEnum;
    targetType: string;
    targetId: string;
    log: string;
  }) {
    return this.prisma.activityLog.create({
      data: {
        userId: data.userId,
        groupId: data.groupId ?? null,
        actionType: data.actionType,
        targetType: data.targetType,
        targetId: data.targetId,
        log: data.log,
      },
    });
  }
}

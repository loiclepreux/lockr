import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GetHistoryDto } from './dto/get-history.dto';
import { PaginatedResponse } from 'src/utils/interfaces/paginated-response.interface';
import { ActivityLog } from 'prisma/generated/prisma/client';

@Injectable()
export class ActivtyLogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: GetHistoryDto): Promise<PaginatedResponse<ActivityLog>> {
    const page = parseInt(dto.page ?? '1');
    const limit = parseInt(dto.limit ?? '10');
    const skip = (page - 1) * limit;

    const where = {
      groupId: dto.groupId,
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
    console.log('🚀 ~ ActivtyLogService ~ findAll ~ where:', where);

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
}

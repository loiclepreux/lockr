import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AccessStatus } from 'prisma/generated/prisma/client';

@Injectable()
export class AccessRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    return this.prisma.accessRequest.findMany({
      where: {
        respondedId: userId,
      },

      include: {
        requester: {
          select: {
            id: true,
            email: true,

            profile: {
              select: {
                firstName: true,
                lastName: true,
                imgUrl: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, status: AccessStatus) {
    return this.prisma.accessRequest.update({
      where: {
        id,
      },

      data: {
        status,
        responseDate: new Date(),
      },

      include: {
        requester: true,
        responded: true,
      },
    });
  }
}

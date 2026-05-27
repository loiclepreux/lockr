import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { ActivityLogService } from './activity-log.service';
import { GetHistoryDto } from './dto/get-history.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

import { IResponse } from 'src/utils/interfaces/response.interface';
import { PaginatedResponse } from 'src/utils/interfaces/paginated-response.interface';
import { ActivityLog } from 'prisma/generated/prisma/client';

@UseGuards(AuthGuard)
@Controller('activitylog')
export class ActivityLogController {
  constructor(private readonly historyService: ActivityLogService) {}

  @Get()
  async findAll(@Query() query: GetHistoryDto): Promise<IResponse<PaginatedResponse<ActivityLog>>> {
    return {
      data: await this.historyService.findAll(query),
      dataType: 'ActivityLog',
      timeStamp: new Date(),
    };
  }

  @Get('recent')
  async findRecent(@Req() req: any): Promise<IResponse<ActivityLog[]>> {
    console.log('REQ USER ACTIVITY LOG =>', req.user);
    const userId = req.user.sub;

    return {
      data: await this.historyService.findRecentByUser(userId),
      dataType: 'ActivityLog',
      timeStamp: new Date(),
    };
  }
}

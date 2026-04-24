import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ActivtyLogService } from './activity-log.service';
import { GetHistoryDto } from './dto/get-history.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { PaginatedResponse } from 'src/utils/interfaces/paginated-response.interface';
import { ActivityLog } from 'prisma/generated/prisma/client';

@UseGuards(AuthGuard)
@Controller('activitylog')
export class ActivtyLogController {
  constructor(private readonly historyService: ActivtyLogService) {}

  @Get()
  async findAll(@Query() query: GetHistoryDto): Promise<IResponse<PaginatedResponse<ActivityLog>>> {
    return {
      data: await this.historyService.findAll(query),
      dataType: 'ActivityLog',
      timeStamp: new Date(),
    };
  }
}

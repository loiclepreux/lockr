import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLogService } from './activity-log.service';
import { GetHistoryDto } from './dto/get-history.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { PaginatedResponse } from 'src/utils/interfaces/paginated-response.interface';
import { ActivityLog } from 'prisma/generated/prisma/client';
import type { RequestWithUser } from 'src/utils/interfaces/request-with-user.interface';

@ApiTags('Activity Log')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('activitylog')
export class ActivityLogController {
  constructor(private readonly historyService: ActivityLogService) {}

  @ApiOperation({ summary: 'Historique paginé des actions' })
  @Get()
  async findAll(@Query() query: GetHistoryDto): Promise<IResponse<PaginatedResponse<ActivityLog>>> {
    return {
      data: await this.historyService.findAll(query),
      dataType: 'ActivityLog',
      timeStamp: new Date(),
    };
  }

  @ApiOperation({ summary: 'Activités récentes de l\'utilisateur connecté' })
  @Get('recent')
  async findRecent(@Req() req: RequestWithUser): Promise<IResponse<ActivityLog[]>> {
    return {
      data: await this.historyService.findRecentByUser(req.user.sub),
      dataType: 'ActivityLog',
      timeStamp: new Date(),
    };
  }
}

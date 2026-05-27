import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Req() req: any) {
    const userId = req.user.sub;

    return {
      data: await this.dashboardService.getStats(userId),
      dataType: 'DashboardStats',
      timeStamp: new Date(),
    };
  }
}

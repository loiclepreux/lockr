import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import type { RequestWithUser } from 'src/utils/interfaces/request-with-user.interface';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Statistiques globales (total docs, groupes, partages, notifs)' })
  @Get('stats')
  async getStats(@Req() req: RequestWithUser) {
    return {
      data: await this.dashboardService.getStats(req.user.sub),
      dataType: 'DashboardStats',
      timeStamp: new Date(),
    };
  }

  @ApiOperation({ summary: 'Imports mensuels de documents (12 derniers mois)' })
  @Get('monthly-imports')
  getMonthlyImports(@Req() req: RequestWithUser) {
    return this.dashboardService.getMonthlyImports(req.user.sub);
  }

  @ApiOperation({ summary: 'Répartition des documents par type de fichier' })
  @Get('documents-by-type')
  getDocumentsByType(@Req() req: RequestWithUser) {
    return this.dashboardService.getDocumentsByType(req.user.sub);
  }
}

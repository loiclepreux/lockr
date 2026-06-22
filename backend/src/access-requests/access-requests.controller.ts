import { Controller, Param, Body, Get, Req, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AccessRequestsService } from './access-requests.service';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { UpdateAccessRequestDto } from './dto/update-access-requests.dto';
import type { RequestWithUser } from 'src/utils/interfaces/request-with-user.interface';

@ApiTags('Access Requests')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('access-requests')
export class AccessRequestsController {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}

  @ApiOperation({ summary: 'Lister mes demandes d\'accès' })
  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<IResponse<any>> {
    return {
      data: await this.accessRequestsService.findAllForUser(req.user.sub),
      dataType: 'AccessRequest',
      timeStamp: new Date(),
    };
  }

  @ApiOperation({ summary: 'Répondre à une demande d\'accès (ACCEPTED / REJECTED)' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAccessRequestDto,
  ): Promise<IResponse<any>> {
    return {
      data: await this.accessRequestsService.update(id, dto.status),
      dataType: 'AccessRequest',
      timeStamp: new Date(),
    };
  }
}

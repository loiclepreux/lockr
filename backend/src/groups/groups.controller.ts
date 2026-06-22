import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { addMemberDTO } from './dto/add-member.dto';
import { AddDocToGroupDto } from './dto/add-doc-to-group.dto';
import type { RequestWithUser } from 'src/utils/interfaces/request-with-user.interface';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({ summary: 'Créer un groupe' })
  @ApiResponse({ status: 201, description: 'Groupe créé' })
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @Req() req: RequestWithUser) {
    return this.groupsService.create({
      ...createGroupDto,
      creatorId: req.user.sub,
    });
  }

  @ApiOperation({ summary: 'Ajouter un membre au groupe' })
  @Post(':id/members')
  async addMember(
    @Param('id') groupId: string,
    @Body() addMemberDto: addMemberDTO,
    @Req() req: RequestWithUser,
  ) {
    return this.groupsService.addMember(groupId, addMemberDto, req.user.sub);
  }

  @ApiOperation({ summary: 'Ajouter un document au groupe' })
  @Post(':id/documents')
  async addDocument(
    @Param('id') groupId: string,
    @Body() addDocToGroupDto: AddDocToGroupDto,
    @Req() req: RequestWithUser,
  ) {
    return this.groupsService.addDocToGroup(groupId, addDocToGroupDto, req.user.sub);
  }

  @ApiOperation({ summary: 'Lister mes groupes (créés + rejoints)' })
  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.groupsService.findAll(req.user.sub);
  }

  @ApiOperation({ summary: 'Détails d\'un groupe' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @ApiOperation({ summary: 'Modifier un groupe' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @ApiOperation({ summary: 'Supprimer un groupe (créateur uniquement)' })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.groupsService.remove(id, req.user.sub);
  }

  @ApiOperation({ summary: 'Retirer un document du groupe' })
  @Delete(':groupId/documents/:docId')
  removeDocFromGroup(
    @Param('groupId') groupId: string,
    @Param('docId') docId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.groupsService.removeDocFromGroup(groupId, docId, req.user.sub);
  }

  @ApiOperation({ summary: 'Lister les documents d\'un groupe' })
  @Get(':groupId/documents')
  getGroupDocuments(@Param('groupId') groupId: string, @Req() req: RequestWithUser) {
    return this.groupsService.getGroupDocuments(groupId, req.user.sub);
  }
}

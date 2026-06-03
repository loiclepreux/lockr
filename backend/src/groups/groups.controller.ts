import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { addMemberDTO } from './dto/add-member.dto';
import { AddDocToGroupDto } from './dto/add-doc-to-group.dto';
import type { Request } from 'express';

type RequestWithUser = Request & {
  user: {
    sub: string;
  };
};

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createGroupDto: CreateGroupDto, @Req() req: any) {
    console.log('User from request:', req.user);

    const newGroupData = {
      ...createGroupDto,
      creatorId: req.user?.id || req.user?.sub,
    };

    return this.groupsService.create(newGroupData);
  }

  @Post(':id/members')
  @UseGuards(AuthGuard)
  async addMember(
    @Param('id') groupId: string,
    @Body() addMemberDTO: addMemberDTO,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.user?.sub;

    return this.groupsService.addMember(groupId, addMemberDTO, userId);
  }

  @Post(':id/documents')
  @UseGuards(AuthGuard)
  async addDocument(
    @Param('id') groupId: string,
    @Body() addDocToGroupDto: AddDocToGroupDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.user?.sub;
    return this.groupsService.addDocToGroup(groupId, addDocToGroupDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: any) {
    return this.groupsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || req.user?.sub;

    return this.groupsService.remove(id, userId);
  }

  @Delete(':groupId/documents/:docId')
  removeDocFromGroup(
    @Param('groupId') groupId: string,
    @Param('docId') docId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.groupsService.removeDocFromGroup(groupId, docId, req.user.sub);
  }

  @Get(':groupId/documents')
  getGroupDocuments(@Param('groupId') groupId: string) {
    return this.groupsService.getGroupDocuments(groupId);
  }
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-document.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}

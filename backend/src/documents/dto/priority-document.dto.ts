import { IsEnum } from 'class-validator';
import { DocPriority } from 'prisma/generated/prisma/client';

export class UpdateDocumentPriorityDto {
  @IsEnum(DocPriority)
  priority: DocPriority;
}

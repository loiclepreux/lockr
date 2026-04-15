import { IsEnum } from 'class-validator';
import { DocStatus } from 'prisma/generated/prisma/client';

export class UpdateDocumentStatusDto {
    @IsEnum(DocStatus)
    status: DocStatus;
}

import { IsDateString, IsEnum, IsOptional, IsString, MinLength, IsUUID } from 'class-validator';
import { extentionEnum } from 'prisma/generated/prisma/client';

export class CreateDocumentDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsEnum(extentionEnum)
  extension: extentionEnum;

  @IsUUID()
  docTypeId: string;

  @IsOptional()
  @IsDateString()
  addedDate?: string;
}

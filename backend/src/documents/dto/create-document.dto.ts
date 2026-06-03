import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { extentionEnum } from 'prisma/generated/prisma/client';

export class CreateDocumentDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;

  @IsEnum(extentionEnum)
  extension: extentionEnum;

  @IsUUID()
  docTypeId: string;

  @IsOptional()
  @IsDateString()
  addedDate?: string;
}

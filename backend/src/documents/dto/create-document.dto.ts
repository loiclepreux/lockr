import { IsDateString, IsEnum, IsNotEmpty, IsString, MinLength, IsUUID } from 'class-validator';
import { extentionEnum } from 'prisma/generated/prisma/client';

export class CreateDocumentDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(extentionEnum)
  extension: extentionEnum;

  @IsString()
  @IsNotEmpty()
  size: string; // à ajuster ensuite si tu veux gérer BigInt proprement

  @IsUUID()
  docTypeId: string;

  @IsDateString()
  addedDate: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;
}

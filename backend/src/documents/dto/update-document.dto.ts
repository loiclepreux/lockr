import { IsDateString, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsUUID()
  docTypeId?: string;

  @IsOptional()
  @IsDateString()
  addedDate?: string;
}

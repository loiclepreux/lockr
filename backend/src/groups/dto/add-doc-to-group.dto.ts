import { IsUUID, IsOptional, IsDateString } from 'class-validator';

export class AddDocToGroupDto {
  @IsUUID()
  docId!: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}

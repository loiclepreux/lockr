import { IsOptional, IsString, IsEnum, IsNumberString } from 'class-validator';
import { targetEnum } from 'prisma/generated/prisma/client';

export class GetHistoryDto {
  @IsString()
  groupId: string;

  @IsOptional()
  @IsEnum(targetEnum)
  actionType?: targetEnum;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}

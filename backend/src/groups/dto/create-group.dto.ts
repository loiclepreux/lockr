import { IsString, IsInt, IsEnum, IsOptional, IsUrl, MinLength } from 'class-validator';
import { privacyEnum } from 'prisma/generated/prisma/client';

export class CreateGroupDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsEnum(privacyEnum)
  privacy: privacyEnum;

  @IsOptional()
  @IsUrl()
  imgUrl?: string;
}
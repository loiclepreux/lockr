import { IsEnum } from 'class-validator';
import { AccessStatus } from 'prisma/generated/prisma/client';

export class UpdateAccessRequestDto {
  @IsEnum(AccessStatus)
  status: AccessStatus;
}

import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateShareDto {
    @IsUUID()
    receiverId: string;

    @IsOptional()
    @IsDateString()
    expirationDate?: string;
}

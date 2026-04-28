import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator"
import { RoleEnum } from "prisma/generated/prisma/enums"

export class removeMemberDTO {

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    userId: string

    @IsEnum(RoleEnum)
    role: RoleEnum
}
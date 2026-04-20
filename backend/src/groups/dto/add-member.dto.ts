import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator"
import { RoleEnum } from "prisma/generated/prisma/enums"

export class addMemberDTO {

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    userId: string

    @IsEnum(RoleEnum)
    role: RoleEnum
}
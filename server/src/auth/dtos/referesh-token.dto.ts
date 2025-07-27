import { IsString } from "class-validator";

export class ReferTokenDto {
    @IsString()
    refreshToken: string
}
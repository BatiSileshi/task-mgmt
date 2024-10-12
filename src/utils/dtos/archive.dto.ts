import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class ArchiveDto {
    @ApiProperty()
    @IsNotEmpty()
    id: string;
    @ApiProperty()
    @IsOptional()
    @IsString()
    archiveReason: string;
}
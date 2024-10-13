import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateListDto{
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    project: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}
export class UpdateListDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;
}
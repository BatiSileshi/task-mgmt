import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProjectDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty()
    @IsString()
    description: string;
    @ApiProperty()
    @IsString()
    startDate: string;
    @ApiProperty()
    @IsString()
    dueDate: string;
    owner: string;
}
export class UpdateProjectDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;
    @ApiProperty()
    @IsString()
    // @IsDate()
    // @Type(() => Date)
    @IsOptional()
    startDate: string;
    @ApiProperty()
    @IsString()
    // @IsDate()
    // @Type(() => Date)
    @IsOptional()
    dueDate: string;
}
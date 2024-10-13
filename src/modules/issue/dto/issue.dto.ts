import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateIssueDto{
    @ApiProperty()
    @IsString()
    title: string;
    @ApiProperty()
    @IsString()
    description: string;
    @IsString()
    @IsOptional()
    status: string;
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    project: string;

}
export class UpdateIssueDto{
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    id: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    title: string;
    @ApiProperty()
    @IsOptional()
    @IsString()
    description: string;
    @IsString()
    @IsOptional()
    status: string;
}
export class UpdateIssueStatusDto{
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    id: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    status: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateIssueDto{
    @ApiProperty()
    @IsString()
    title: string;
    @ApiProperty()
    @IsString()
    description: string;
    @IsString()
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
    title: string;
    @ApiProperty()
    @IsString()
    description: string;
    @IsString()
    status: string;
}
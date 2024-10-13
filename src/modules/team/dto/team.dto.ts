import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, ArrayNotEmpty, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateTeamDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    project: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({ type: [String]})
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsMongoId({ each: true })
    membersIds: string[];
}

export class UpdateTeamDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    id: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({ type: [String]})
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsMongoId({ each: true })
    membersIds: string[];
}
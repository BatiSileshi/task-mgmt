import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto{
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    task: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    comment: string;
}
export class UpdateCommentDto{
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    id: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    comment: string; 
} 
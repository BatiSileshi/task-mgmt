import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, ArrayNotEmpty, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
    @ApiProperty()
    @IsString()
    @IsMongoId()
    list: string;
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
}
export class UpdateTaskDto {
    @ApiProperty()
    @IsString()
    @IsMongoId()
    id: string;
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
}
export class AssignTaskDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    id: string;
    @ApiProperty({ type: [String]})
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsMongoId()
    assignedTo: string[];
}
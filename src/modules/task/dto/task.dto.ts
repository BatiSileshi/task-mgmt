import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, ArrayNotEmpty, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
    @IsMongoId()
    @IsOptional()
    list: string;
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
    @IsOptional()
    startDate: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
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
    @IsMongoId({ each: true })
    assignedTo: string[];
}
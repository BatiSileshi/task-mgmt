import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateUserDto {
    @ApiProperty()
    @IsString()
    firstName: string;
    @ApiProperty()
    @IsString()
    lastName: string;
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    phoneNumber: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    jobTitile: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    location: string;
    @IsString()
    @IsOptional()
    role: string;
}

export class UpdateUserDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    firstName: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    email: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    phoneNumber: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    jobTitile: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    location: string;
    @IsString()
    @IsOptional()
    role: string;
}

export class ArchiveUserDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    id: string;
    @ApiProperty()
    @IsOptional()
    @IsString()
    archiveReason: string;
}
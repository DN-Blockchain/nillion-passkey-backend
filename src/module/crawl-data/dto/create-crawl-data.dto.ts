import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class InfoDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Type(() => String)
    name?: string;

    @ApiProperty()
    @IsNotEmpty()
    phone_number: number;
}

export class CreateCrawlDataDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    member_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    type: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => InfoDto)
    information: InfoDto;
}
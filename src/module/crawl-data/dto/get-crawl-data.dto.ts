import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetListCrawlDataDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    type: number;
}

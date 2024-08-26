import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateCrawlDataDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsArray()
	@Type(() => Number)
	crawl_data_ids: number[];
}

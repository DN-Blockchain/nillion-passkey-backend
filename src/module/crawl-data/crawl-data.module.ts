import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlData } from 'src/module/crawl-data/entities/crawl-data.entity';
import { CrawlDataService } from './crawl-data.service';
import { CrawlDataController } from './crawl-data.controller';

@Module({
	imports: [TypeOrmModule.forFeature([CrawlData])],
	controllers: [CrawlDataController],
	providers: [CrawlDataService],
	exports: [CrawlDataService],
})
export class CrawlDataModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmAsyncConfigPostgres } from './config/typeorm.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CrawlDataModule } from './module/crawl-data/crawl-data.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync(typeOrmAsyncConfigPostgres),
		EventEmitterModule.forRoot(),
		CrawlDataModule
	],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Passkey } from 'src/module/crawl-data/entities/crawl-data.entity';
import { PasskeyService } from './passkey.service';
import { PasskeyController } from './passkey.controller';

@Module({
	// imports: [TypeOrmModule.forFeature([Passkey])],
	imports: [],
	controllers: [PasskeyController],
	providers: [PasskeyService],
	exports: [PasskeyService],
})
export class PasskeyModule {}

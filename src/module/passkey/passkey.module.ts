import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasskeyService } from './passkey.service';
import { PasskeyController } from './passkey.controller';
import { User } from '../user/entities/user.entity';
import { Passkey } from './entities/passkey.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Passkey, User])],
	controllers: [PasskeyController],
	providers: [PasskeyService],
	exports: [PasskeyService],
})
export class PasskeyModule {}

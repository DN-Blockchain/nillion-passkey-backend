import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmAsyncConfigMysql } from './config/typeorm.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PasskeyModule } from './module/passkey/passkey.module';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync(typeOrmAsyncConfigMysql),
		EventEmitterModule.forRoot(),
		CacheModule.register({
			isGlobal: true,
			ttl: 1000 * 60 * 5, // 5 minutes
		}),
		PasskeyModule,
		UserModule,
		AuthModule,
	],
})
export class AppModule {}

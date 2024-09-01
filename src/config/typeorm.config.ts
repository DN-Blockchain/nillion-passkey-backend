import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseMysql } from './constant.config';
import { DataSource } from 'typeorm';

const configMysql: any = {
	type: databaseMysql.TYPE,
	host: databaseMysql.HOST,
	port: databaseMysql.PORT,
	username: databaseMysql.USERNAME,
	database: databaseMysql.DATABASE,
	password: databaseMysql.PASSWORD,
	entities: [`${__dirname}/../**/*.entity.{js,ts}`],
	migrations: [`${__dirname}/../database/migrations/*{.ts,.js}`],
	cli: {
		migrationsDir: `${__dirname}/../database/migrations,`,
	},
	extra: { charset: 'utf8mb4_unicode_ci' },
	synchronize: false,
	logging: databaseMysql.LOGGING,
};

export const typeOrmAsyncConfigMysql: TypeOrmModuleAsyncOptions = {
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: async (): Promise<TypeOrmModuleOptions> => configMysql,
};

export const typeOrmConfig = new DataSource(configMysql);

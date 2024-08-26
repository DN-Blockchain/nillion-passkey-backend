import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databasePostgres } from './constant.config';

const configPostgres: any = {
	type: databasePostgres.TYPE,
	host: databasePostgres.HOST,
	port: databasePostgres.PORT,
	username: databasePostgres.USERNAME,
	database: databasePostgres.DATABASE,
	password: databasePostgres.PASSWORD,
	entities: [`${__dirname}/../**/*.entity.{js,ts}`],
	migrations: [`${__dirname}/../database/migrations/*{.ts,.js}`],
	cli: {
		migrationsDir: `${__dirname}/../database/migrations,`,
	},
	extra: { charset: 'utf8mb4_unicode_ci' },
	synchronize: false,
	logging: databasePostgres.LOGGING,
};

export const typeOrmAsyncConfigPostgres: TypeOrmModuleAsyncOptions = {
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: async (): Promise<TypeOrmModuleOptions> => configPostgres,
};

export const typeOrmConfig: TypeOrmModuleOptions = configPostgres;

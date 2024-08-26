import * as dotenv from 'dotenv';

dotenv.config();
const configEnv = process.env;

export const databasePostgres = {
	TYPE: configEnv.DB_TYPE_POSTGRES || 'postgres',
	HOST: configEnv.DB_HOST_POSTGRES,
	USERNAME: configEnv.DB_USERNAME_POSTGRES,
	PASSWORD: configEnv.DB_PASSWORD_POSTGRES,
	DATABASE: configEnv.DB_NAME_POSTGRES,
	PORT: +configEnv.DB_PORT_POSTGRES || 5432,
	LOGGING: configEnv.DB_LOGGING == 'ENABLED',
};

export const jwtConfig = {
	SECRET: configEnv.JWT_SECRET,
	EXPIRES_IN: configEnv.JWT_EXPIRES_IN_HOUR,
};

export const redisConfig = {
	URI: configEnv.REDIS_URI,
	PORT: +configEnv.REDIS_PORT,
	HOST: configEnv.REDIS_HOST,
	PASSWORD: configEnv.REDIS_PASSWORD,
};

export const awsS3 = {
	S3_BUCKET: configEnv.S3_BUCKET,
	S3_KEY: configEnv.S3_KEY,
	S3_SECRET: configEnv.S3_SECRET,
	S3_REGION: configEnv.S3_REGION,
};

export const seedConfig = {
	PASSWORD: configEnv.SEED_PASSWORD,
	SEED_PASSWORD: configEnv.SEED_PASSWORD,
};

export const sessionConfig = {
	SECRET: configEnv.SESSION_SECRET,
};

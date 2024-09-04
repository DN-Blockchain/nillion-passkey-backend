import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/constant.config';
import { UserService } from './user.service';
import { Passkey } from '../passkey/entities/passkey.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Passkey]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: jwtConfig.SECRET,
			signOptions: {
				expiresIn: jwtConfig.EXPIRES_IN,
			},
		}),
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}

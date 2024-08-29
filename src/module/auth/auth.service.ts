import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommonLogger } from '../../share/common/logger/common.logger';
import { SignUpDto } from './dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { QueryRunner, Repository } from 'typeorm';
import { userError } from '../user/user.constant';
import * as bcrypt from 'bcrypt';
import { runQuery } from '../../share/util/helper.util';
import { LogInDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@InjectRepository(User)
		private readonly userModel: Repository<User>,
	) {}

	public async signUp(signUpDto: SignUpDto): Promise<User> {
		try {
			const isUser = await this.userModel.findOne({ where: { email: signUpDto.email } });
			if (isUser) throw new HttpException(userError.EMAIL_IS_EXISTS, HttpStatus.BAD_REQUEST);

			const hashPassword = await bcrypt.hash(signUpDto.password, 12);
			return await runQuery(async (queryRunner: QueryRunner) => {
				const user: User = await this.userModel.create({
					email: signUpDto.email,
					password: hashPassword,
				});
				await queryRunner.manager.save(user);

				return { ...user, password: undefined };
			});
		} catch (error) {
			CommonLogger.log(`${new Date().toDateString()}_ERRORS_POST_AUTH_LOGIN_WITH_EMAIL_SERVICE_`, error);
			throw error;
		}
	}

	public async login(logInDto: LogInDto): Promise<{ access_token: string; expired_at: number }> {
		try {
			const user = await this.userModel.findOne({ where: { email: logInDto.email } });
			if (!user) throw new HttpException(userError.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

			const checkPassword = await bcrypt.compare(logInDto.password, user.password);
			if (!checkPassword) throw new HttpException(userError.WRONG_PASSWORD, HttpStatus.BAD_REQUEST);

			const payload: any = { user_id: user.id };
			const config = process.env;
			const expiresIn = config.JWT_EXPIRES_IN_HOUR;
			const token = this.jwtService.sign(payload, { secret: config.JWT_SECRET, expiresIn });

			await this.userModel.update({ id: user.id }, { current_token: token });

			return {
				access_token: token,
				expired_at: 86400,
			};
		} catch (error) {
			CommonLogger.log(`${new Date().toDateString()}_ERRORS_POST_AUTH_LOGIN_WITH_EMAIL_SERVICE_`, error);
			throw error;
		}
	}

	public async logout(userId: number): Promise<null> {
		try {
			await this.userModel.update({ id: userId }, { current_token: null });
			return null;
		} catch (error) {
			CommonLogger.log(`${new Date().toDateString()}_ERRORS_POST_AUTH_LOGOUT_SERVICE_`, error);
			throw error;
		}
	}
}

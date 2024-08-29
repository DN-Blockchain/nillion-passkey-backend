import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { jwtConfig } from '../../../config/constant.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: jwtConfig.SECRET,
		});
	}

	/**
	 * @description This is function validate authentication middleware.
	 * @param payload
	 * @param done
	 */
	public async validate(payload: any, done: VerifiedCallback) {
		try {
			const { user_id } = payload;
			const user = await this.userRepository.findOne({ where: { id: user_id, current_token: Not(IsNull()) } });
			if (!user) throw new UnauthorizedException();

			return done(null, user);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}
}

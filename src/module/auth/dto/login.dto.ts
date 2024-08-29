import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { authConstant } from '../auth.constant';

export class LogInDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	@MinLength(8, { message: authConstant.PASSWORD_NOT_MATCH_REQUIREMENT })
	password: string;
}

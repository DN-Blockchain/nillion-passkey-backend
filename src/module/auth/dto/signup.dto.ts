import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { authConstant } from '../auth.constant';

export class SignupDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
		message: authConstant.PASSWORD_NOT_MATCH_REQUIREMENT,
	})
	password: string;
}

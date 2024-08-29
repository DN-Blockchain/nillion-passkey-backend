import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { RegistrationResponseJSON } from '@simplewebauthn/server/script/deps';

export class VerifyRegistrationDto {
	@ApiProperty()
	@IsNotEmpty()
	credential: RegistrationResponseJSON;
}

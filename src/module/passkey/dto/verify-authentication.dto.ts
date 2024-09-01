import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AuthenticationResponseJSON } from '@simplewebauthn/server/script/deps';

export class VerifyAuthenticationDto {
	@ApiProperty()
	@IsNotEmpty()
	credential: AuthenticationResponseJSON;
}

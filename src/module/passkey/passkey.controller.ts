import { ApiTags } from '@nestjs/swagger';
import { PasskeyService } from './passkey.service';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { VerifyRegistrationDto } from './dto/verify-registration.dto';

@ApiTags('passkey')
@Controller('/')
export class PasskeyController {
	constructor(private passkeyService: PasskeyService) {}

	@Post('/generate-registration-options')
	async generateRegistrationOption(): Promise<any> {
		console.log('Get challenge register');
		const userId = '83c206d6-1dfc-4809-8f89-0dc1a63807d3';
		const options = await this.passkeyService.generateRegistrationOption(userId);
		return { createOptions: { publicKey: options } };
	}

	@Post('/verify-registration')
	async verifyRegistration(@Body() { credential }: VerifyRegistrationDto): Promise<any> {
		const userId = '83c206d6-1dfc-4809-8f89-0dc1a63807d3';
		const verified = await this.passkeyService.verifyRegistration(userId, credential);
		return { verified };
	}
}

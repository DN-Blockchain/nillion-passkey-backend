import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PasskeyService } from './passkey.service';
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { VerifyRegistrationDto } from './dto/verify-registration.dto';
import { GetUser } from 'src/share/decorator';
import { JwtAuthGuard } from 'src/share/guard/jwt.guard';

@ApiTags('passkey')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/')
export class PasskeyController {
	constructor(private passkeyService: PasskeyService) { }

	@Post('/generate-registration-options')
	async generateRegistrationOptions(@GetUser() user): Promise<any> {
		const options = await this.passkeyService.generateRegistrationOption(user);
		return { createOptions: { publicKey: options } };
	}

	@Post('/verify-registration')
	async verifyRegistration(@GetUser() user, @Body() { credential }: VerifyRegistrationDto): Promise<any> {
		const verified = await this.passkeyService.verifyRegistration(user, credential);
		return { verified };
	}

	@Post('/generate-authentication-options')
	async generateAuthenticationOptions(@GetUser() user): Promise<any> {
		const options = await this.passkeyService.generateRegistrationOption(user);
		return { createOptions: { publicKey: options } };
	}

	@Post('/verify-authentication')
	async verifyAuthentication(@GetUser() user, @Body() { credential }: VerifyRegistrationDto): Promise<any> {
		const verified = await this.passkeyService.verifyRegistration(user, credential);
		return { verified };
	}
}

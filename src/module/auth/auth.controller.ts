import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { authConstant } from './auth.constant';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../share/guard/jwt.guard';
import { GetUser } from '../../share/decorator';

@ApiTags('Auth')
@Controller(authConstant.BASE_PATH)
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	async signup(@Body() signUpDto: SignupDto) {
		return await this.authService.signUp(signUpDto);
	}

	@Post('login')
	async logIn(@Body() logInDto: LogInDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const { access_token, expired_at } = await this.authService.login(logInDto);
		res.cookie('access_token', access_token);
		return { access_token, expired_at };
	}

	@Post('logout')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async logout(@GetUser() user) {
		return await this.authService.logout(user.id);
	}
}
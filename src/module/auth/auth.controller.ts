import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../share/guard/jwt.guard';
import { auth_constant } from './auth.constant';
import { SignUpDto } from './dto/signup.dto';
import { GetUser } from 'src/share/decorator';

@ApiTags('Auth')
@Controller(auth_constant.BASE_PATH)
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	async signup(@Body() signUpDto: SignUpDto) {
		return await this.authService.signUp(signUpDto);
	}

	@Post('login')
	async logIn(@Body() logInDto: LogInDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const { access_token, expired_at } = await this.authService.login(logInDto);
		res.cookie('access_token', access_token);
		return { access_token, expired_at };
	}

	// Logout.
	@Post('logout')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async logout(@GetUser() user) {
		return await this.authService.logout(user.id);
	}
}

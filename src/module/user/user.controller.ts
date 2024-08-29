import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../share/guard/jwt.guard';
import { GetUser } from '../../share/decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {

	@Get('profile')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async getUserProfile(@GetUser() user) {
		return { ...user, password: undefined };
	}

}
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../share/guard/jwt.guard';
import { GetUser } from '../../share/decorator';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async getUserProfile(@GetUser() user) {
		return { ...user, password: undefined };
	}
}

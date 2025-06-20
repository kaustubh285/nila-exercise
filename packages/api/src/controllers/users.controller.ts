import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { type UserOperationDto } from '../dto/user-operation.dto';
import { AuthenticatedController } from '../utils/controller.decorator';
import { Public } from '../utils/auth.guard';

@AuthenticatedController('/users')
export class UsersController {
	constructor(@Inject(UsersService) private readonly usersService: UsersService) {}

	@Public()
	@Post('/register')
	async createUser(@Body() body: UserOperationDto) {
		return this.usersService.createUser(body);
	}

	@Public()
	@Post('/login')
	async login(@Body() body: UserOperationDto) {
		return this.usersService.login(body);
	}
}

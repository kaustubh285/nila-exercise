import { Module } from '@nestjs/common';

import { DatabaseModule } from './db/db';
import { ProjectsService } from 'services/projects.service.ts';

import { ProjectsController } from 'controllers/projects.controller.ts';
import { UsersController } from 'controllers/users.controller.ts';
import { UsersService } from 'services/users.service.ts';
import { TasksController } from 'controllers/tasks.controller.ts';
import { TasksService } from 'services/tasks.service.ts';
@Module({
	imports: [DatabaseModule],
	controllers: [ProjectsController, UsersController, TasksController],
	providers: [ProjectsService, UsersService, TasksService],
	exports: [DatabaseModule],
})
export class AppModule {}

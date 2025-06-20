import { Module } from '@nestjs/common';

import { DatabaseModule } from './db/db';
import { ProjectsService } from 'services/projects.service.ts';

import { ProjectsController } from 'controllers/projects.controller.ts';

@Module({
	imports: [DatabaseModule],
	controllers: [ProjectsController],
	providers: [ProjectsService],
	exports: [DatabaseModule],
})
export class AppModule {}

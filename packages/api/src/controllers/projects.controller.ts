import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { type CreateProjectDto } from '../dto/create-project.dto';
import { AuthenticatedController } from '../utils/controller.decorator';
import { Public } from 'utils/auth.guard';

@AuthenticatedController('/projects')
export class ProjectsController {
	constructor(@Inject(ProjectsService) private readonly projectsService: ProjectsService) {}

	@Post('')
	async createProject(@Body() body: CreateProjectDto) {
		return this.projectsService.createProject(body);
	}

	@Get('')
	async getProjects() {
		try {
			const projects = await this.projectsService.getProjects();
			return {
				data: projects,
			};
		} catch (error) {
			console.error('Error fetching projects:', error);
			throw error;
		}
	}
}

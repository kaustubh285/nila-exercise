import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Delete, Patch, Post, Req } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { type CreateProjectDto } from '../dto/create-project.dto';
import { AuthenticatedController } from '../utils/controller.decorator';
import type { AuthenticatedRequest } from '../../types/authenticated-request';

@AuthenticatedController('/projects')
export class ProjectsController {
	constructor(@Inject(ProjectsService) private readonly projectsService: ProjectsService) {}

	@Post('')
	async createProject(@Body() body: CreateProjectDto, @Req() request: AuthenticatedRequest) {
		try {
			const userId = request['user'].id;
			const project = await this.projectsService.createProject({ ...body, userId });
			return { data: project[0] };
		} catch (error) {
			throw new HttpException('Failed to create project', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get('')
	async getAllProjectsForUser(@Req() request: AuthenticatedRequest) {
		try {
			const userId = request['user'].id;
			console.log('Fetching all projects for user', userId);
			const projects = await this.projectsService.getProjects(userId);
			return {
				data: projects,
				count: projects.length,
			};
		} catch (error) {
			throw new HttpException('Failed to fetch projects', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get(':projectId')
	async getProjectById(@Param('projectId') projectId: string, @Req() request: AuthenticatedRequest) {
		try {
			const userId = request['user'].id;

			console.log(`Fetching project with ID: ${projectId} for user ID: ${userId}`);
			const result = await this.projectsService.getProjectById(projectId, userId);

			if (!result) {
				throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
			}

			return { ...result };
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException('Failed to fetch project', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Delete(':projectId')
	async deleteProject(@Param('projectId') projectId: string, @Req() request: AuthenticatedRequest) {
		try {
			const userId = request['user'].id;
			const deletedProject = await this.projectsService.deleteProject(projectId, userId);

			if (!deletedProject || deletedProject.length === 0) {
				throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
			}

			return { success: true };
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException('Failed to delete project', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

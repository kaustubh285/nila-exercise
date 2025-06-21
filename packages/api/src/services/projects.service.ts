import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import type { DB } from '../db/db.ts';
import { projectsTable } from 'db/schemas/project.schema.ts';
import { eq, and, isNull, count, sql } from 'drizzle-orm';
import { tasksTable } from 'db/schemas/task.schema.ts';

@Injectable()
export class ProjectsService {
	constructor(@Inject('DRIZZLE_CLIENT') private readonly db: DB) {}

	async createProject(data: { name: string; description: string; userId: string }) {
		try {
			const result = await this.db
				.insert(projectsTable)
				.values({
					name: data.name,
					description: data.description,
					userId: data.userId,
				})
				.returning();

			return result;
		} catch (error) {
			throw new InternalServerErrorException('Failed to create project');
		}
	}

	async getProjects(userId: string) {
		try {
			const projects = await this.db
				.select({
					id: projectsTable.id,
					name: projectsTable.name,
					description: projectsTable.description,
					createdAt: projectsTable.createdAt,
					updatedAt: projectsTable.updatedAt,
					userId: projectsTable.userId,
					taskCount: count(tasksTable.id),
				})
				.from(projectsTable)
				.leftJoin(tasksTable, eq(projectsTable.id, sql`${tasksTable.projectId}::uuid`))
				.where(and(eq(projectsTable.userId, userId), isNull(projectsTable.deletedAt), isNull(tasksTable.deletedAt)))
				.groupBy(projectsTable.id);

			return projects;
		} catch (error) {
			console.error('Error fetching projects:', error);
			throw new InternalServerErrorException('Failed to fetch projects');
		}
	}

	async getProjectById(projectId: string, userId: string) {
		try {
			const result = await this.db
				.select({
					project: projectsTable,
					task: tasksTable,
				})
				.from(projectsTable)
				.leftJoin(tasksTable, eq(projectsTable.id, sql`${tasksTable.projectId}::uuid`))
				.where(
					and(
						eq(projectsTable.id, projectId),
						eq(projectsTable.userId, userId),
						isNull(projectsTable.deletedAt),
						isNull(tasksTable.deletedAt),
					),
				)
				.orderBy(tasksTable.createdAt);

			if (!result || result.length === 0) {
				return null;
			}

			const project = result[0].project;
			const tasks = result.filter((row) => row.task).map((row) => row.task);

			return { ...project, tasks };
		} catch (error) {
			throw new InternalServerErrorException('Failed to fetch project');
		}
	}

	async deleteProject(projectId: string, userId: string) {
		try {
			const project = await this.getProjectById(projectId, userId);
			if (!project) {
				throw new NotFoundException('Project not found');
			}

			const result = await this.db
				.update(projectsTable)
				.set({
					deletedAt: new Date(),
				})
				.where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
				.returning();

			return result;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new InternalServerErrorException('Failed to delete project');
		}
	}
}

import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import type { DB } from '../db/db.ts';

import { eq } from 'drizzle-orm';
import { tasksTable } from '../db/schemas/task.schema.ts';

@Injectable()
export class TasksService {
	constructor(@Inject('DRIZZLE_CLIENT') private readonly db: DB) {}

	async createTask(data: { title: string; description: string; projectId: string }) {
		try {
			const result = await this.db.insert(tasksTable).values(data).returning();
			return result[0];
		} catch (error) {
			throw new InternalServerErrorException('Failed to create task');
		}
	}

	async getTasks(projectId: string) {
		try {
			return await this.db.select().from(tasksTable).where(eq(tasksTable.projectId, projectId));
		} catch (error) {
			throw new InternalServerErrorException('Failed to fetch tasks');
		}
	}

	async updateTask(taskId: string, data: { title?: string; description?: string; completed?: boolean }) {
		try {
			const result = await this.db.update(tasksTable).set(data).where(eq(tasksTable.id, taskId)).returning();
			if (!result.length) {
				throw new NotFoundException(`Task with ID ${taskId} not found`);
			}
			return result;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new InternalServerErrorException('Failed to update task');
		}
	}

	async deleteTask(taskId: string) {
		try {
			const result = await this.db
				.update(tasksTable)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(tasksTable.id, taskId))
				.returning();
			if (!result.length) {
				throw new NotFoundException(`Task with ID ${taskId} not found`);
			}
			return result;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new InternalServerErrorException('Failed to delete task');
		}
	}
}

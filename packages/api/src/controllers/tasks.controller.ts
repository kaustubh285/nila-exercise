import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Patch, Post, Req } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { type CreateTaskDto } from '../dto/create-task.dto';
import { type UpdateTaskDto } from '../dto/update-task.dto';
import { AuthenticatedController } from '../utils/controller.decorator';
import type { AuthenticatedRequest } from '../../types/authenticated-request';

@AuthenticatedController('/tasks')
export class TasksController {
	constructor(@Inject(TasksService) private readonly tasksService: TasksService) {}

	@Post('')
	async createTask(@Body() body: CreateTaskDto, @Req() request: AuthenticatedRequest) {
		try {
			return await this.tasksService.createTask({ ...body });
		} catch (error) {
			throw new HttpException('Failed to create task', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Patch(':taskId')
	async updateTask(@Param('taskId') taskId: string, @Body() body: UpdateTaskDto) {
		try {
			const updatedTask = await this.tasksService.updateTask(taskId, body);
			if (!updatedTask || updatedTask.length === 0) {
				throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
			}
			return { data: updatedTask[0] };
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException('Failed to update task', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Delete(':taskId')
	async deleteTask(@Param('taskId') taskId: string) {
		try {
			const deletedTask = await this.tasksService.deleteTask(taskId);
			if (!deletedTask || deletedTask.length === 0) {
				throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
			}
			return { success: true };
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException('Failed to delete task', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

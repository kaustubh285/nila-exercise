import { Injectable, Inject } from '@nestjs/common';
import type { DB } from '../db/db.ts';
import { projectsTable } from 'db/schemas/project.schema.ts';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProjectsService {
	constructor(@Inject('DRIZZLE_CLIENT') private readonly db: DB) {}

	async createProject(data: { name: string; description: string }) {
		console.log('Creating project with data:', data);

		const result = await this.db
			.insert(projectsTable)
			.values({
				name: data.name,
				description: data.description,
				userId: uuid(),
			})
			.returning();

		return result;
	}

	async getProjects() {
		console.log('Fetching projects');

		const projects = (await this.db.select().from(projectsTable)).map((project) => {
			console.log('Project fetched:', project);
			console.log(Object.keys(project));
			return project;
		});

		return projects;
	}
}

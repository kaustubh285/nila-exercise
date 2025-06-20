import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { projectsTable } from './project.schema';
import { relations } from 'drizzle-orm';
export const taskStatuses = ['todo', 'in_progress', 'done'] as const;
export type TaskStatus = (typeof taskStatuses)[number];
export const taskStatusEnum = pgEnum('task_status', taskStatuses);

export const taskPriorities = ['low', 'medium', 'high'] as const;
export type TaskPriority = (typeof taskPriorities)[number];
export const taskPriorityEnum = pgEnum('task_priority', taskPriorities);

export const tasksTable = pgTable('tasks', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
	projectId: text('project_id').notNull(),
	status: taskStatusEnum().notNull().default('todo'),
	priority: taskPriorityEnum().notNull().default('medium'),
});

export const tasksRelations = relations(tasksTable, ({ one }) => ({
	project: one(projectsTable, {
		fields: [tasksTable.projectId],
		references: [projectsTable.id],
	}),
}));

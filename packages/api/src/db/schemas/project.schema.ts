import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { usersTable } from './user.schema';
import { tasksTable } from './task.schema';

export const projectsTable = pgTable('projects', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
	userId: text('user_id').notNull(),
	deletedAt: timestamp('deleted_at'),
});

export const projectsRelations = relations(projectsTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [projectsTable.userId],
		references: [usersTable.id],
	}),
	tasks: many(tasksTable),
}));

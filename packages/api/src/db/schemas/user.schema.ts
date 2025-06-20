import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { projectsTable } from './project.schema';

export const usersTable = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: text('email').notNull(),
	password: text('password').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
	projects: many(projectsTable),
}));

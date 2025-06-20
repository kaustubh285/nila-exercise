import { Type, type Static } from '@sinclair/typebox';

export const createTaskSchema = Type.Object({
	title: Type.String({ minLength: 1, maxLength: 255 }),
	description: Type.String({ minLength: 1, maxLength: 500 }),
	projectId: Type.String({ format: 'uuid' }),
	status: Type.Optional(Type.Enum({ todo: 'todo', in_progress: 'in_progress', done: 'done' })),
	priority: Type.Optional(Type.Enum({ low: 'low', medium: 'medium', high: 'high' })),
});

export type CreateTaskDto = Static<typeof createTaskSchema>;

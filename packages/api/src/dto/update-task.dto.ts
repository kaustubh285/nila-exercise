import { Type, type Static } from '@sinclair/typebox';

export const updateTaskSchema = Type.Object({
	title: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
	description: Type.Optional(Type.String({ minLength: 1, maxLength: 500 })),
	status: Type.Optional(Type.Enum({ todo: 'todo', in_progress: 'in_progress', done: 'done' })),
	priority: Type.Optional(Type.Enum({ low: 'low', medium: 'medium', high: 'high' })),
});

export type UpdateTaskDto = Static<typeof updateTaskSchema>;

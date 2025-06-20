import { Type, type Static } from '@sinclair/typebox';

export const createProjectSchema = Type.Object({
	name: Type.String({ minLength: 1, maxLength: 255 }),
	description: Type.String({ minLength: 1, maxLength: 500 }),
});

export type CreateProjectDto = Static<typeof createProjectSchema>;

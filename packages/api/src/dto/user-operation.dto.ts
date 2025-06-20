import { Type, type Static } from '@sinclair/typebox';

export const UserOperationSchema = Type.Object({
	email: Type.String({ format: 'email' }),
	password: Type.String({ minLength: 1 }),
});

export type UserOperationDto = Static<typeof UserOperationSchema>;

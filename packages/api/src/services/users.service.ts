import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as jose from 'jose';
import type { DB } from '../db/db';
import { usersTable } from '../db/schemas/user.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
	constructor(@Inject('DRIZZLE_CLIENT') private readonly db: DB) {}

	async createUser(data: { email: string; password: string }) {
		const result = await this.db
			.insert(usersTable)
			.values({
				email: data.email,
				password: data.password,
			})
			.returning({
				id: usersTable.id,
				email: usersTable.email,
			});

		return result[0];
	}

	async login(data: { email: string; password: string }) {
		const user = await this.db.query.usersTable.findFirst({
			where: eq(usersTable.email, data.email),
		});

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isPasswordValid = data.password === user.password;

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = {
			id: user.id,
			email: user.email,
		};
		console.log('JWT is token for ', payload);

		const token = await new jose.SignJWT(payload)
			.setProtectedHeader({ alg: 'HS256' })
			.sign(new TextEncoder().encode('your-secret-key'));

		return {
			access_token: token,
			user_id: user.id,
			email: user.email,
		};
	}
}

import { type CanActivate, type ExecutionContext, Inject, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jose from 'jose';
import type { FastifyRequest } from 'fastify';

export const Public = () => SetMetadata('isPublic', true);

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException();
		}

		try {
			const { payload } = await jose.jwtVerify(token, new TextEncoder().encode('your-secret-key'));
			request['user'] = payload;
		} catch (error) {
			console.error('JWT verification failed:', error);
			throw new UnauthorizedException('Invalid token');
		}
		return true;
	}

	private extractTokenFromHeader(request: FastifyRequest): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}

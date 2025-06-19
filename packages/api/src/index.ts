import {NestFactory} from '@nestjs/core';
import {FastifyAdapter, type NestFastifyApplication} from '@nestjs/platform-fastify';
import {SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './app.module';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import compression from '@fastify/compress';
import {OPENAPI_SPEC} from './utils/openapi-builder.ts';
import {apiReference} from '@scalar/nestjs-api-reference';
import {configureNestJsTypebox} from 'nestjs-typebox';
import {migrate} from 'drizzle-orm/node-postgres/migrator';
import {db} from './db/db.ts';
import {Logger} from 'nestjs-pino';
import {VersioningType} from '@nestjs/common';

const env = {
	projectID: 'jdk53pvd',
	serviceName: 'nila-api',
	serviceVersion: 'git-sha',
	environment: 'production',
	debug: false,
};

configureNestJsTypebox({
	patchSwagger: true,
	setFormats: true,
});

export async function runMigrations() {
	console.log('Running migrations...');

	try {
		// This will automatically run needed migrations
		await migrate(db, { migrationsFolder: './drizzle' });
		console.log('Migrations completed successfully');
	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	}
}

if (process.env.ENV !== 'development') {
	await runMigrations();
	if (process.env.ENV === 'production') {
		H.init(env);
	}
}

export const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
	bufferLogs: true,
	rawBody: true,
});

app.useLogger(app.get(Logger));

// MUST be before swagger module init
app.enableVersioning({
	type: VersioningType.URI,
	defaultVersion: '1',
});

app.enableCors({
	origin: true, // or '*' for less secure but simpler configuration
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
});

await app.register(helmet);
await app.register(compression);
await app.register(multipart);

const document = SwaggerModule.createDocument(app, OPENAPI_SPEC, {
	operationIdFactory: (controllerKey, methodKey, version) => methodKey + version.toUpperCase(),
});

app.use('/api-docs', apiReference({ spec: { content: document }, withFastify: true }));

await app.listen(process.env.PORT || 3000, '0.0.0.0');

console.info(`http://localhost:${process.env.PORT}`);
console.info(`http://localhost:${process.env.PORT}/api-docs`);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { fastifyHelmet } from '@fastify/helmet';
import { TypeboxValidationPipe } from './pipes/typebox-validation.pipe';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

	app.enableCors({
		origin: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
		credentials: true,
		maxAge: 86400,
	});

	await app.register(fastifyHelmet, {
		contentSecurityPolicy: false,
	});

	// Use TypeBoxValidationPipe for validating requests
	// app.useGlobalPipes(new TypeboxValidationPipe());

	const config = new DocumentBuilder()
		.setTitle('Nila API')
		.setDescription('API documentation for Nila')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	const port = process.env.PORT || 3000;
	await app.listen(port, '0.0.0.0');
}

bootstrap();

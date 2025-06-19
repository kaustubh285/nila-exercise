import {Module} from '@nestjs/common';
import {LoggerModule} from 'nestjs-pino';
import {DatabaseModule} from './db/db';
import {TestService} from 'services/test.service.ts';
import {loggerOptions} from './utils/logger.config';
import {TestController} from "controllers/reports.controller.ts";

@Module({
	imports: [DatabaseModule, LoggerModule.forRoot(loggerOptions)],
	controllers: [
		TestController
	],
	providers: [
		TestService,
	],
	exports: [],
})
export class AppModule {
}

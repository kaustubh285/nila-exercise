import {Post} from '@nestjs/common';
import {Type} from "@sinclair/typebox";
import {Validate} from 'nestjs-typebox';
import {AuthenticatedController} from 'utils/controller.decorator.ts';

@AuthenticatedController('/test')
export class TestController {


	@Post('/')
	@Validate({
		request: [
			{name: 'accountId', type: 'query', schema: Type.Optional(Type.Number()), coerceTypes: true }
		]
	})
	async sendExpenseReports(accountId: number | undefined) {


	}
}

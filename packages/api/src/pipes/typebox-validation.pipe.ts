import { type PipeTransform, Injectable, type ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Value } from '@sinclair/typebox/value';
import { type TSchema } from '@sinclair/typebox';

@Injectable()
export class TypeboxValidationPipe implements PipeTransform {
	constructor(private schema: TSchema) {}

	transform(value: any, metadata: ArgumentMetadata) {
		if (!Value.Check(this.schema, value)) {
			const errors = [...Value.Errors(this.schema, value)];
			throw new BadRequestException(`Validation failed: ${errors.map((e) => e.message).join(', ')}`);
		}
		return value;
	}
}

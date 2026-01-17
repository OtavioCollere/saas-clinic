import {
	type ArgumentMetadata,
	Injectable,
	type PipeTransform,
} from "@nestjs/common";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
	constructor(private readonly schema: any) {}

	transform(value: any, metadata: ArgumentMetadata) {
		this.schema.parse(value);
		return value;
	}
}

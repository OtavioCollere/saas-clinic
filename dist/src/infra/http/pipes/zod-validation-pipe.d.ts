import { type ArgumentMetadata, type PipeTransform } from "@nestjs/common";
export declare class ZodValidationPipe implements PipeTransform {
    private readonly schema;
    constructor(schema: any);
    transform(value: any, metadata: ArgumentMetadata): any;
}

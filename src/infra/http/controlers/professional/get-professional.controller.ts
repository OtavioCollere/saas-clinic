import { isLeft, unwrapEither } from "@/shared/either/either";
import { ProfessionalNotFoundError } from "@/shared/errors/professional-not-found-error";
import { GetProfessionalUseCase } from "@/domain/application/use-cases/professional/get-professional";
import {
	Controller,
	Get,
	NotFoundException,
	Param,
} from "@nestjs/common";
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ProfessionalPresenter } from "../../presenters/professional-presenter";

const getProfessionalParamsSchema = z.object({
	professionalId: z.string(),
});

type GetProfessionalParamsSchema = z.infer<typeof getProfessionalParamsSchema>;

const getProfessionalParamsValidationPipe = new ZodValidationPipe(getProfessionalParamsSchema);

@ApiTags("Professionals")
@Controller("/professionals")
export class GetProfessionalController {
	constructor(private readonly getProfessionalUseCase: GetProfessionalUseCase) {}

	@Get("/:professionalId")
	@ApiOperation({
		summary: "Get professional by ID",
		description: "Retrieves professional information by its identifier.",
	})
	@ApiParam({
		name: "professionalId",
		type: String,
		description: "Professional identifier",
	})
	@ApiOkResponse({
		description: "Professional retrieved successfully",
	})
	@ApiNotFoundResponse({
		description: "Professional not found",
	})
	async handle(@Param(getProfessionalParamsValidationPipe) params: GetProfessionalParamsSchema) {
		const { professionalId } = params;

		const result = await this.getProfessionalUseCase.execute({ professionalId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ProfessionalNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { professional } = unwrapEither(result);

		return ProfessionalPresenter.toHTTP(professional);
	}
}

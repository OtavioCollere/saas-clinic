import { isLeft, unwrapEither } from "@/core/either/either";
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";
import { GetProfessionalUseCase } from "@/domain/application/use-cases/professional/get-professional";
import { Controller, Get, NotFoundException, Param, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ProfessionalPresenter } from "../../presenters/professional-presenter";

const getProfessionalParamsSchema = z.object({
	professionalId: z.string(),
});

type GetProfessionalParamsSchema = z.infer<typeof getProfessionalParamsSchema>;

const getProfessionalParamsValidationPipe = new ZodValidationPipe(getProfessionalParamsSchema);

@Controller("/professionals")
export class GetProfessionalController {
	constructor(private readonly getProfessionalUseCase: GetProfessionalUseCase) {}

	@Get("/:professionalId")
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

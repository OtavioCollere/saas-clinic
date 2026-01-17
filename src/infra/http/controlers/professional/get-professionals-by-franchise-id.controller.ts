import { isLeft, unwrapEither } from "@/core/either/either";
import { FranchiseNotFoundError } from "@/core/errors/franchise-not-found-error";
import type { GetProfessionalsByFranchiseIdUseCase } from "@/domain/application/use-cases/professional/get-professionals-by-franchise-id";
import { Controller, Get, NotFoundException, Param, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ProfessionalPresenter } from "../presenters/professional-presenter";

const getProfessionalsByFranchiseIdParamsSchema = z.object({
	franchiseId: z.string(),
});

type GetProfessionalsByFranchiseIdParamsSchema = z.infer<typeof getProfessionalsByFranchiseIdParamsSchema>;

const getProfessionalsByFranchiseIdParamsValidationPipe = new ZodValidationPipe(getProfessionalsByFranchiseIdParamsSchema);

@Controller("/franchises")
export class GetProfessionalsByFranchiseIdController {
	constructor(private readonly getProfessionalsByFranchiseIdUseCase: GetProfessionalsByFranchiseIdUseCase) {}

	@Get("/:franchiseId/professionals")
	async handle(@Param(getProfessionalsByFranchiseIdParamsValidationPipe) params: GetProfessionalsByFranchiseIdParamsSchema) {
		const { franchiseId } = params;

		const result = await this.getProfessionalsByFranchiseIdUseCase.execute({ franchiseId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case FranchiseNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { professionals } = unwrapEither(result);

		return professionals.map(ProfessionalPresenter.toHTTP);
	}
}

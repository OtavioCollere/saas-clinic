import { isLeft, unwrapEither } from "@/shared/either/either";
import { FranchiseNotFoundError } from "@/shared/errors/franchise-not-found-error";
import { GetProfessionalsByFranchiseIdUseCase } from "@/domain/application/use-cases/professional/get-professionals-by-franchise-id";
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

const getProfessionalsByFranchiseIdParamsSchema = z.object({
	franchiseId: z.string(),
});

type GetProfessionalsByFranchiseIdParamsSchema = z.infer<typeof getProfessionalsByFranchiseIdParamsSchema>;

const getProfessionalsByFranchiseIdParamsValidationPipe = new ZodValidationPipe(getProfessionalsByFranchiseIdParamsSchema);

@ApiTags("Professionals")
@Controller("/franchises")
export class GetProfessionalsByFranchiseIdController {
	constructor(private readonly getProfessionalsByFranchiseIdUseCase: GetProfessionalsByFranchiseIdUseCase) {}

	@Get("/:franchiseId/professionals")
	@ApiOperation({
		summary: "Get professionals by franchise",
		description: "Retrieves all professionals for a specific franchise.",
	})
	@ApiParam({
		name: "franchiseId",
		type: String,
		description: "Franchise identifier",
	})
	@ApiOkResponse({
		description: "Professionals retrieved successfully",
	})
	@ApiNotFoundResponse({
		description: "Franchise not found",
	})
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

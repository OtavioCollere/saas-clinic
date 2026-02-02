import { isLeft, unwrapEither } from "@/shared/either/either";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { FetchFranchisesByClinicIdUseCase } from "@/domain/application/use-cases/franchise/fetch-franchises-by-clinic-id";
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
import { FranchisePresenter } from "../../presenters/franchise-presenter";

const fetchFranchisesByClinicIdParamsSchema = z.object({
	clinicId: z.string(),
});

type FetchFranchisesByClinicIdParamsSchema = z.infer<typeof fetchFranchisesByClinicIdParamsSchema>;

const fetchFranchisesByClinicIdParamsValidationPipe = new ZodValidationPipe(fetchFranchisesByClinicIdParamsSchema);

@ApiTags("Franchises")
@Controller("/clinics")
export class FetchFranchisesByClinicIdController {
	constructor(private readonly fetchFranchisesByClinicIdUseCase: FetchFranchisesByClinicIdUseCase) {}

	@Get("/:clinicId/franchises")
	@ApiOperation({
		summary: "Fetch franchises by clinic",
		description: "Retrieves all franchises for a specific clinic.",
	})
	@ApiParam({
		name: "clinicId",
		type: String,
		description: "Clinic identifier",
	})
	@ApiOkResponse({
		description: "Franchises retrieved successfully",
	})
	@ApiNotFoundResponse({
		description: "Clinic not found",
	})
	async handle(@Param(fetchFranchisesByClinicIdParamsValidationPipe) params: FetchFranchisesByClinicIdParamsSchema) {
		const { clinicId } = params;

		const result = await this.fetchFranchisesByClinicIdUseCase.execute({ clinicId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ClinicNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { franchises } = unwrapEither(result);

		return franchises.map(FranchisePresenter.toHTTP);
	}
}

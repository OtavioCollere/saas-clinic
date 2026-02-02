import { isLeft, unwrapEither } from "@/shared/either/either";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { GetClinicByIdUseCase } from "@/domain/application/use-cases/clinic/get-clinic-by-id";
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
import { ClinicPresenter } from "../../presenters/clinic-presenter";

const getClinicByIdParamsSchema = z.object({
	clinicId: z.string(),
});

type GetClinicByIdParamsSchema = z.infer<typeof getClinicByIdParamsSchema>;

const getClinicByIdParamsValidationPipe = new ZodValidationPipe(getClinicByIdParamsSchema);

@ApiTags("Clinics")
@Controller("/clinics")
export class GetClinicByIdController {
	constructor(private readonly getClinicByIdUseCase: GetClinicByIdUseCase) {}

	@Get("/:clinicId")
	@ApiOperation({
		summary: "Get clinic by ID",
		description: "Retrieves clinic information by its identifier.",
	})
	@ApiParam({
		name: "clinicId",
		type: String,
		description: "Clinic identifier",
	})
	@ApiOkResponse({
		description: "Clinic retrieved successfully",
	})
	@ApiNotFoundResponse({
		description: "Clinic not found",
	})
	async handle(@Param(getClinicByIdParamsValidationPipe) params: GetClinicByIdParamsSchema) {
		const { clinicId } = params;

		const result = await this.getClinicByIdUseCase.execute({ clinicId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ClinicNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { clinic } = unwrapEither(result);

		return ClinicPresenter.toHTTP(clinic);
	}
}

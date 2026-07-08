import { isLeft, unwrapEither } from "@/shared/either/either";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { GetProfessionalsByClinicIdUseCase } from "@/domain/application/use-cases/professional/get-professionals-by-clinic-id";
import {
	Controller,
	Get,
	Inject,
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

const getProfessionalsByClinicIdParamsSchema = z.object({
	clinicId: z.string().uuid(),
});

type GetProfessionalsByClinicIdParamsSchema = z.infer<typeof getProfessionalsByClinicIdParamsSchema>;

const getProfessionalsByClinicIdParamsValidationPipe = new ZodValidationPipe(getProfessionalsByClinicIdParamsSchema);

@ApiTags("Professionals")
@Controller("/clinics")
export class GetProfessionalsByClinicIdController {
	constructor(
		@Inject(GetProfessionalsByClinicIdUseCase)
		private readonly getProfessionalsByClinicIdUseCase: GetProfessionalsByClinicIdUseCase
	) {}

	@Get("/:clinicId/professionals")
	@ApiOperation({
		summary: "Get professionals by clinic",
		description: "Retrieves all professionals for a specific clinic.",
	})
	@ApiParam({
		name: "clinicId",
		type: String,
		description: "Clinic identifier (UUID)",
	})
	@ApiOkResponse({
		description: "Professionals retrieved successfully",
	})
	@ApiNotFoundResponse({
		description: "Clinic not found",
	})
	async handle(@Param(getProfessionalsByClinicIdParamsValidationPipe) params: GetProfessionalsByClinicIdParamsSchema) {
		const { clinicId } = params;

		const result = await this.getProfessionalsByClinicIdUseCase.execute({ clinicId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ClinicNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { professionals, users } = unwrapEither(result);

		return professionals.map((professional) => {
			const user = users.get(professional.userId.toString());
			return {
				...ProfessionalPresenter.toHTTP(professional),
				name: user?.name ?? null,
			};
		});
	}
}


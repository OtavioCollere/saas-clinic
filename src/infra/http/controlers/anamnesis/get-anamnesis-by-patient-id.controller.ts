import { isLeft, unwrapEither } from "@/shared/either/either";
import { PatientNotFoundError } from "@/shared/errors/patient-not-found-error";
import { GetAnamnesisByPatientIdUseCase } from "@/domain/application/use-cases/anamnesis/get-anamnesis-by-patient-id";
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
import { AnamnesisPresenter } from "../../presenters/anamnesis-presenter";

const getAnamnesisByPatientIdParamsSchema = z.object({
	patientId: z.string(),
});

type GetAnamnesisByPatientIdParamsSchema = z.infer<typeof getAnamnesisByPatientIdParamsSchema>;

const getAnamnesisByPatientIdParamsValidationPipe = new ZodValidationPipe(getAnamnesisByPatientIdParamsSchema);

@ApiTags("Anamnesis")
@Controller("/patients")
export class GetAnamnesisByPatientIdController {
	constructor(private readonly getAnamnesisByPatientIdUseCase: GetAnamnesisByPatientIdUseCase) {}

	@Get("/:patientId/anamnesis")
	@ApiOperation({
		summary: "Get anamnesis by patient",
		description: "Retrieves anamnesis information for a specific patient.",
	})
	@ApiParam({
		name: "patientId",
		type: String,
		description: "Patient identifier",
	})
	@ApiOkResponse({
		description: "Anamnesis retrieved successfully",
	})
	@ApiNotFoundResponse({
		description: "Patient not found",
	})
	async handle(@Param(getAnamnesisByPatientIdParamsValidationPipe) params: GetAnamnesisByPatientIdParamsSchema) {
		const { patientId } = params;

		const result = await this.getAnamnesisByPatientIdUseCase.execute({ patientId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case PatientNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { anamnesis } = unwrapEither(result);

		if (!anamnesis) {
			return null;
		}

		return AnamnesisPresenter.toHTTP(anamnesis);
	}
}

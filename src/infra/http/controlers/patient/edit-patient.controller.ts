import { isLeft, unwrapEither } from "@/shared/either/either";
import { PatientNotFoundError } from "@/shared/errors/patient-not-found-error";
import { EditPatientUseCase } from "@/domain/application/use-cases/patient/edit-patient";
import {
	BadRequestException,
	Body,
	Controller,
	NotFoundException,
	Param,
	Patch,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { PatientPresenter } from "../../presenters/patient-presenter";

const editPatientBodySchema = z.object({
	name: z.string().optional(),
	birthDay: z.coerce.date().optional(),
	address: z.string().optional(),
	zipCode: z.string().optional(),
});

const editPatientParamsSchema = z.object({
	patientId: z.string(),
});

type EditPatientBodySchema = z.infer<typeof editPatientBodySchema>;
type EditPatientParamsSchema = z.infer<typeof editPatientParamsSchema>;

const editPatientBodyValidationPipe = new ZodValidationPipe(editPatientBodySchema);
const editPatientParamsValidationPipe = new ZodValidationPipe(editPatientParamsSchema);

@ApiTags("Patients")
@Controller("/patients")
export class EditPatientController {
	constructor(private readonly editPatientUseCase: EditPatientUseCase) {}

	@Patch("/:patientId")
	@ApiOperation({
		summary: "Edit patient",
		description: "Updates patient information.",
	})
	@ApiParam({
		name: "patientId",
		type: String,
		description: "Patient identifier",
	})
	@ApiOkResponse({
		description: "Patient updated successfully",
	})
	@ApiNotFoundResponse({
		description: "Patient not found",
	})
	@ApiBadRequestResponse({
		description: "Invalid request data",
	})
	async handle(
		@Param(editPatientParamsValidationPipe) params: EditPatientParamsSchema,
		@Body(editPatientBodyValidationPipe) body: EditPatientBodySchema,
	) {
		const { patientId } = params;
		const { name, birthDay, address, zipCode } = body;

		const result = await this.editPatientUseCase.execute({
			patientId,
			name,
			birthDay,
			address,
			zipCode,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case PatientNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { patient } = unwrapEither(result);

		return PatientPresenter.toHTTP(patient);
	}
}

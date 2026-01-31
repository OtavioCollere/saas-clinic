import { isLeft, unwrapEither } from "@/shared/either/either";
import { PatientNotFoundError } from "@/shared/errors/patient-not-found-error";
import { EditPatientUseCase } from "@/domain/application/use-cases/patient/edit-patient";
import { BadRequestException, Body, Controller, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
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

@Controller("/patients")
export class EditPatientController {
	constructor(private readonly editPatientUseCase: EditPatientUseCase) {}

	@Patch("/:patientId")
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

import { isLeft, unwrapEither } from "@/shared/either/either";
import { PatientNotFoundError } from "@/shared/errors/patient-not-found-error";
import { GetPatientByIdUseCase } from "@/domain/application/use-cases/patient/get-patient-by-id";
import { Controller, Get, NotFoundException, Param, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { PatientPresenter } from "../../presenters/patient-presenter";

const getPatientByIdParamsSchema = z.object({
	patientId: z.string(),
});

type GetPatientByIdParamsSchema = z.infer<typeof getPatientByIdParamsSchema>;

const getPatientByIdParamsValidationPipe = new ZodValidationPipe(getPatientByIdParamsSchema);

@Controller("/patients")
export class GetPatientByIdController {
	constructor(private readonly getPatientByIdUseCase: GetPatientByIdUseCase) {}

	@Get("/:patientId")
	async handle(@Param(getPatientByIdParamsValidationPipe) params: GetPatientByIdParamsSchema) {
		const { patientId } = params;

		const result = await this.getPatientByIdUseCase.execute({ patientId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case PatientNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { patient } = unwrapEither(result);

		return PatientPresenter.toHTTP(patient);
	}
}

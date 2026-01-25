import { isLeft, unwrapEither } from "@/core/either/either";
import { ClinicNotFoundError } from "@/core/errors/clinic-not-found-error";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import type { RegisterPatientUseCase } from "@/domain/application/use-cases/patient/register-patient";
import { Body, Controller, NotFoundException, Param, Post, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { PatientPresenter } from "../../presenters/patient-presenter";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { User } from "@/domain/enterprise/entities/user";

const registerPatientBodySchema = z.object({
	clinicId: z.string(),
	name: z.string(),
	birthDay: z.coerce.date(),
	address: z.string(),
	zipCode: z.string(),
	anamnesis: z.any(),
});


type RegisterPatientBodySchema = z.infer<typeof registerPatientBodySchema>;

const registerPatientBodyValidationPipe = new ZodValidationPipe(registerPatientBodySchema);
@Controller("/clinics")
export class RegisterPatientController {
	constructor(private readonly registerPatientUseCase: RegisterPatientUseCase) {}

	@Post("/:clinicId/patients")
	async handle(
		@CurrentUser() user: User,
		@Body(registerPatientBodyValidationPipe) body: RegisterPatientBodySchema,
	) {
		const personId = user.id.toString();
		const { clinicId, name, birthDay, address, zipCode, anamnesis } = body;

		const result = await this.registerPatientUseCase.execute({
			clinicId,
			personId,
			name,
			birthDay,
			address,
			zipCode,
			anamnesis,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ClinicNotFoundError:
					throw new NotFoundException(error.message);
				case UserNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { patient } = unwrapEither(result);

		return PatientPresenter.toHTTP(patient);
	}
}

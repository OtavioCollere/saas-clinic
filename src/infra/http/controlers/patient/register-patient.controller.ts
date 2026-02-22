import { isLeft, unwrapEither } from "@/shared/either/either";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { CpfAlreadyExistsError } from "@/shared/errors/cpf-already-exists-error";
import { EmailAlreadyExistsError } from "@/shared/errors/email-already-exists-error";
import { InvalidCpfError } from "@/shared/errors/invalid-cpf-error";
import { InvalidEmailError } from "@/shared/errors/invalid-email-error";
import { RegisterPatientUseCase } from "@/domain/application/use-cases/patient/register-patient";
import {
	BadRequestException,
	Body,
	Controller,
	Inject,
	NotFoundException,
	Param,
	Post,
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

const registerPatientBodySchema = z.object({
	name: z.string(),
	cpf: z.string(),
	email: z.string().email(),
	birthDay: z.coerce.date(),
	address: z.string(),
	zipCode: z.string(),
});

const registerPatientParamsSchema = z.object({
	clinicId: z.string(),
});

type RegisterPatientParamsSchema = z.infer<typeof registerPatientParamsSchema>;


type RegisterPatientBodySchema = z.infer<typeof registerPatientBodySchema>;

const registerPatientBodyValidationPipe = new ZodValidationPipe(registerPatientBodySchema);
const registerPatientParamsValidationPipe = new ZodValidationPipe(registerPatientParamsSchema);

@ApiTags("Patients")
@Controller("/clinics")
export class RegisterPatientController {
	constructor(
		@Inject(RegisterPatientUseCase)
		private readonly registerPatientUseCase: RegisterPatientUseCase
	) {}

	@Post("/:clinicId/patients")
	@ApiOperation({
		summary: "Register patient",
		description: "Creates a new patient for a clinic.",
	})
	@ApiParam({
		name: "clinicId",
		type: String,
		description: "Clinic identifier",
	})
	@ApiOkResponse({
		description: "Patient created successfully",
	})
	@ApiNotFoundResponse({
		description: "Clinic not found",
	})
	@ApiBadRequestResponse({
		description: "Invalid request data or email/CPF already exists",
	})
	async handle(
		@Param(registerPatientParamsValidationPipe) params: RegisterPatientParamsSchema,
		@Body(registerPatientBodyValidationPipe) body: RegisterPatientBodySchema,
	) {
		const { clinicId } = params;
		const { name, cpf, email, birthDay, address, zipCode } = body;

		console.log('📝 [RegisterPatientController] Recebendo requisição:', {
			clinicId,
			name,
			cpf,
			email,
			birthDay,
			address,
			zipCode,
		});

		const result = await this.registerPatientUseCase.execute({
			clinicId,
			name,
			cpf,
			email,
			birthDay,
			address,
			zipCode,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			console.error('❌ [RegisterPatientController] Erro ao criar paciente:', {
				errorType: error.constructor.name,
				errorMessage: error.message,
			});

			switch (error.constructor) {
				case ClinicNotFoundError:
					throw new NotFoundException(error.message);
				case EmailAlreadyExistsError:
				case CpfAlreadyExistsError:
				case InvalidCpfError:
				case InvalidEmailError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { patient } = unwrapEither(result);

		console.log('✅ [RegisterPatientController] Paciente criado com sucesso:', patient.id.toString());

		return PatientPresenter.toHTTP(patient);
	}
}

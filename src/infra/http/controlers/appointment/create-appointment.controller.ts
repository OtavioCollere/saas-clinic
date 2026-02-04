import { isLeft, unwrapEither } from "@/shared/either/either";
import { ProfessionalNotFoundError } from "@/shared/errors/professional-not-found-error";
import { FranchiseNotFoundError } from "@/shared/errors/franchise-not-found-error";
import { PatientNotFoundError } from "@/shared/errors/patient-not-found-error";
import { AppointmentConflictError } from "@/shared/errors/appointment-conflict-error";
import { CreateAppointmentUseCase } from "@/domain/application/use-cases/appointment/create-appointment";
import {
	BadRequestException,
	Body,
	Controller,
	NotFoundException,
	Post,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { AppointmentPresenter } from "../../presenters/appointment-presenter";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { AppointmentItem } from "@/domain/enterprise/entities/appointment-item";

const createAppointmentBodySchema = z.object({
	professionalId: z.string(),
	franchiseId: z.string(),
	patientId: z.string(),
	name: z.string(),
	appointmentItems: z.array(
		z.object({
			procedureId: z.string(),
			price: z.number(),
			notes: z.string().optional(),
		})
	),
	startAt: z.string().datetime(),
	durationInMinutes: z.number(),
});

type CreateAppointmentBodySchema = z.infer<typeof createAppointmentBodySchema>;

const createAppointmentBodyValidationPipe = new ZodValidationPipe(createAppointmentBodySchema);

@ApiTags("Appointments")
@Controller("/appointments")
export class CreateAppointmentController {
	constructor(private readonly createAppointmentUseCase: CreateAppointmentUseCase) {}

	@Post()
	@ApiOperation({
		summary: "Create appointment",
		description: "Creates a new appointment for a patient with a professional.",
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				professionalId: { type: 'string', example: 'uuid-do-profissional' },
				franchiseId: { type: 'string', example: 'uuid-da-franquia' },
				patientId: { type: 'string', example: 'uuid-do-paciente' },
				name: { type: 'string', example: 'Consulta de avaliação' },
				appointmentItems: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							procedureId: { type: 'string', example: 'uuid-do-procedimento' },
							price: { type: 'number', example: 150.00 },
							notes: { type: 'string', example: 'Observações opcionais', nullable: true },
						},
						required: ['procedureId', 'price'],
					},
				},
				startAt: { type: 'string', format: 'date-time', example: '2026-02-03T10:00:00Z' },
				durationInMinutes: { type: 'number', example: 60 },
			},
			required: ['professionalId', 'franchiseId', 'patientId', 'name', 'appointmentItems', 'startAt', 'durationInMinutes'],
		},
	})
	@ApiOkResponse({
		description: "Appointment created successfully",
	})
	@ApiNotFoundResponse({
		description: "Professional, franchise or patient not found",
	})
	@ApiBadRequestResponse({
		description: "Invalid request data or appointment conflict",
	})
	async handle(@Body(createAppointmentBodyValidationPipe) body: CreateAppointmentBodySchema) {
		const { professionalId, franchiseId, patientId, name, appointmentItems, startAt, durationInMinutes } = body;

		const appointmentItemsEntities = appointmentItems.map(
			(item) =>
				AppointmentItem.create({
					procedureId: new UniqueEntityId(item.procedureId),
					price: item.price,
					notes: item.notes,
				})
		);

		const result = await this.createAppointmentUseCase.execute({
			professionalId,
			franchiseId,
			patientId,
			name,
			appointmentItems: appointmentItemsEntities,
			startAt: new Date(startAt),
			durationInMinutes,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ProfessionalNotFoundError:
				case FranchiseNotFoundError:
				case PatientNotFoundError:
					throw new NotFoundException(error.message);
				case AppointmentConflictError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { appointment } = unwrapEither(result);

		return AppointmentPresenter.toHTTP(appointment);
	}
}

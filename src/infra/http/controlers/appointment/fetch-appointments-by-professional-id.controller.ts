import { unwrapEither } from "@/shared/either/either";
import { FetchAppointmentsByProfessionalIdUseCase } from "@/domain/application/use-cases/appointment/fetch-appointments-by-professional-id";
import {
	Controller,
	Get,
	Inject,
	Param,
	Query,
} from "@nestjs/common";
import {
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { AppointmentPresenter } from "../../presenters/appointment-presenter";

const fetchAppointmentsByProfessionalIdParamsSchema = z.object({
	professionalId: z.string(),
});

const fetchAppointmentsByProfessionalIdQuerySchema = z.object({
	period: z.enum(['active', 'history']).optional(),
});

type FetchAppointmentsByProfessionalIdParamsSchema = z.infer<typeof fetchAppointmentsByProfessionalIdParamsSchema>;
type FetchAppointmentsByProfessionalIdQuerySchema = z.infer<typeof fetchAppointmentsByProfessionalIdQuerySchema>;

const fetchAppointmentsByProfessionalIdParamsValidationPipe = new ZodValidationPipe(fetchAppointmentsByProfessionalIdParamsSchema);
const fetchAppointmentsByProfessionalIdQueryValidationPipe = new ZodValidationPipe(fetchAppointmentsByProfessionalIdQuerySchema);

@ApiTags("Appointments")
@Controller("/professionals")
export class FetchAppointmentsByProfessionalIdController {
	constructor(
		@Inject(FetchAppointmentsByProfessionalIdUseCase)
		private readonly fetchAppointmentsByProfessionalIdUseCase: FetchAppointmentsByProfessionalIdUseCase
	) {}

	@Get("/:professionalId/appointments")
	@ApiOperation({
		summary: "Fetch appointments by professional",
		description: "Retrieves all appointments for a specific professional.",
	})
	@ApiParam({
		name: "professionalId",
		type: String,
		description: "Professional identifier",
	})
	@ApiOkResponse({
		description: "Appointments retrieved successfully",
	})
	async handle(
		@Param(fetchAppointmentsByProfessionalIdParamsValidationPipe) params: FetchAppointmentsByProfessionalIdParamsSchema,
		@Query(fetchAppointmentsByProfessionalIdQueryValidationPipe) query: FetchAppointmentsByProfessionalIdQuerySchema,
	) {
		const { professionalId } = params;
		const period = query?.period;

		const result = await this.fetchAppointmentsByProfessionalIdUseCase.execute({ professionalId, period });

		const { appointments, professional, patients, users } = unwrapEither(result);

		const professionalUser = professional ? users.get(professional.userId.toString()) : undefined;

		return appointments.map((appointment) => {
			const patient = patients.get(appointment.patientId.toString());
			return AppointmentPresenter.toHTTP(appointment, patient ?? undefined, professionalUser);
		});
	}
}

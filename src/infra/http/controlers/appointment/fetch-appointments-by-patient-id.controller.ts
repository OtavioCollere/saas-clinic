import { unwrapEither } from "@/shared/either/either";
import { FetchAppointmentsByPatientIdUseCase } from "@/domain/application/use-cases/appointment/fetch-appointments-by-patient-id";
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

const fetchAppointmentsByPatientIdParamsSchema = z.object({
	patientId: z.string(),
});

const fetchAppointmentsByPatientIdQuerySchema = z.object({
	period: z.enum(['active', 'history']).optional(),
});

type FetchAppointmentsByPatientIdParamsSchema = z.infer<typeof fetchAppointmentsByPatientIdParamsSchema>;
type FetchAppointmentsByPatientIdQuerySchema = z.infer<typeof fetchAppointmentsByPatientIdQuerySchema>;

const fetchAppointmentsByPatientIdParamsValidationPipe = new ZodValidationPipe(fetchAppointmentsByPatientIdParamsSchema);
const fetchAppointmentsByPatientIdQueryValidationPipe = new ZodValidationPipe(fetchAppointmentsByPatientIdQuerySchema);

@ApiTags("Appointments")
@Controller("/patients")
export class FetchAppointmentsByPatientIdController {
	constructor(
		@Inject(FetchAppointmentsByPatientIdUseCase)
		private readonly fetchAppointmentsByPatientIdUseCase: FetchAppointmentsByPatientIdUseCase
	) {}

	@Get("/:patientId/appointments")
	@ApiOperation({
		summary: "Fetch appointments by patient",
		description: "Retrieves all appointments for a specific patient.",
	})
	@ApiParam({
		name: "patientId",
		type: String,
		description: "Patient identifier",
	})
	@ApiOkResponse({
		description: "Appointments retrieved successfully",
	})
	async handle(
		@Param(fetchAppointmentsByPatientIdParamsValidationPipe) params: FetchAppointmentsByPatientIdParamsSchema,
		@Query(fetchAppointmentsByPatientIdQueryValidationPipe) query?: FetchAppointmentsByPatientIdQuerySchema,
	) {
		const { patientId } = params;
		const period = query?.period;

		const result = await this.fetchAppointmentsByPatientIdUseCase.execute({ patientId, period });

		const { appointments, patient, professionals, users } = unwrapEither(result);

		return appointments.map((appointment) => {
			const professional = professionals.get(appointment.professionalId.toString());
			const user = professional ? users.get(professional.userId.toString()) : undefined;
			return AppointmentPresenter.toHTTP(appointment, patient ?? undefined, user);
		});
	}
}

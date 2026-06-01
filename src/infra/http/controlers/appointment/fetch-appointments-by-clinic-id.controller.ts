import { Inject } from "@nestjs/common";
import { unwrapEither } from "@/shared/either/either";
import { FetchAppointmentsByClinicIdUseCase } from "@/domain/application/use-cases/appointment/fetch-appointments-by-clinic-id";
import {
	Controller,
	Get,
	Param,
	Query,
} from "@nestjs/common";
import {
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { AppointmentPresenter } from "../../presenters/appointment-presenter";

const fetchAppointmentsByClinicIdParamsSchema = z.object({
	clinicId: z.string(),
});

const fetchAppointmentsByClinicIdQuerySchema = z.object({
	period: z.enum(["future", "all"]).optional().default("future"),
});

type FetchAppointmentsByClinicIdParamsSchema = z.infer<typeof fetchAppointmentsByClinicIdParamsSchema>;
type FetchAppointmentsByClinicIdQuerySchema = z.infer<typeof fetchAppointmentsByClinicIdQuerySchema>;

const fetchAppointmentsByClinicIdParamsValidationPipe = new ZodValidationPipe(fetchAppointmentsByClinicIdParamsSchema);
const fetchAppointmentsByClinicIdQueryValidationPipe = new ZodValidationPipe(fetchAppointmentsByClinicIdQuerySchema);

@ApiTags("Appointments")
@Controller("/clinics")
export class FetchAppointmentsByClinicIdController {
	constructor(
		@Inject(FetchAppointmentsByClinicIdUseCase)
		private readonly fetchAppointmentsByClinicIdUseCase: FetchAppointmentsByClinicIdUseCase
	) {}

	@Get("/:clinicId/appointments")
	@ApiOperation({
		summary: "Fetch appointments by clinic ID",
		description: "Retrieves future appointments by default (endAt >= now). Use period=all for all appointments.",
	})
	@ApiParam({
		name: "clinicId",
		type: String,
		description: "Clinic identifier",
	})
	@ApiQuery({
		name: "period",
		enum: ["future", "all"],
		required: false,
		description: "future = only upcoming (default), all = every appointment",
	})
	@ApiOkResponse({
		description: "Appointments retrieved successfully",
	})
	async handle(
		@Param(fetchAppointmentsByClinicIdParamsValidationPipe) params: FetchAppointmentsByClinicIdParamsSchema,
		@Query(fetchAppointmentsByClinicIdQueryValidationPipe) query: FetchAppointmentsByClinicIdQuerySchema
	) {
		const { clinicId } = params;
		const { period } = query;

		const result = await this.fetchAppointmentsByClinicIdUseCase.execute({ clinicId, period });

		const { appointments, patients, professionals, users } = unwrapEither(result);

		return appointments.map((appointment) => {
			const patient = patients.get(appointment.patientId.toString());
			const professional = professionals.get(appointment.professionalId.toString());
			const user = professional ? users.get(professional.userId.toString()) : undefined;
			
			return AppointmentPresenter.toHTTP(appointment, patient, user);
		});
	}
}



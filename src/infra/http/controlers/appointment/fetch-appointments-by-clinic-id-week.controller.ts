import { Inject } from "@nestjs/common";
import { unwrapEither } from "@/shared/either/either";
import { FetchAppointmentsByClinicIdWeekUseCase } from "@/domain/application/use-cases/appointment/fetch-appointments-by-clinic-id-week";
import {
	Controller,
	Get,
	Param,
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

const fetchAppointmentsByClinicIdWeekParamsSchema = z.object({
	clinicId: z.string(),
});

type FetchAppointmentsByClinicIdWeekParamsSchema = z.infer<typeof fetchAppointmentsByClinicIdWeekParamsSchema>;

const fetchAppointmentsByClinicIdWeekParamsValidationPipe = new ZodValidationPipe(fetchAppointmentsByClinicIdWeekParamsSchema);

@ApiTags("Appointments")
@Controller("/clinics")
export class FetchAppointmentsByClinicIdWeekController {
	constructor(
		@Inject(FetchAppointmentsByClinicIdWeekUseCase)
		private readonly fetchAppointmentsByClinicIdWeekUseCase: FetchAppointmentsByClinicIdWeekUseCase
	) {}

	@Get("/:clinicId/appointments/week")
	@ApiOperation({
		summary: "Fetch appointments by clinic ID for current week",
		description: "Retrieves all appointments for a specific clinic within the current week (Monday to Sunday).",
	})
	@ApiParam({
		name: "clinicId",
		type: String,
		description: "Clinic identifier",
	})
	@ApiOkResponse({
		description: "Appointments retrieved successfully",
	})
	async handle(@Param(fetchAppointmentsByClinicIdWeekParamsValidationPipe) params: FetchAppointmentsByClinicIdWeekParamsSchema) {
		const { clinicId } = params;

		const result = await this.fetchAppointmentsByClinicIdWeekUseCase.execute({ clinicId });

		const { appointments, patients, professionals, users } = unwrapEither(result);

		return appointments.map((appointment) => {
			const patient = patients.get(appointment.patientId.toString());
			const professional = professionals.get(appointment.professionalId.toString());
			const user = professional ? users.get(professional.userId.toString()) : undefined;
			
			return AppointmentPresenter.toHTTP(appointment, patient, user);
		});
	}
}


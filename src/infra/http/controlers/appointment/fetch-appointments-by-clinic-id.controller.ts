import { Inject } from "@nestjs/common";
import { unwrapEither } from "@/shared/either/either";
import { FetchAppointmentsByClinicIdUseCase } from "@/domain/application/use-cases/appointment/fetch-appointments-by-clinic-id";
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

const fetchAppointmentsByClinicIdParamsSchema = z.object({
	clinicId: z.string(),
});

type FetchAppointmentsByClinicIdParamsSchema = z.infer<typeof fetchAppointmentsByClinicIdParamsSchema>;

const fetchAppointmentsByClinicIdParamsValidationPipe = new ZodValidationPipe(fetchAppointmentsByClinicIdParamsSchema);

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
		description: "Retrieves all appointments for a specific clinic.",
	})
	@ApiParam({
		name: "clinicId",
		type: String,
		description: "Clinic identifier",
	})
	@ApiOkResponse({
		description: "Appointments retrieved successfully",
	})
	async handle(@Param(fetchAppointmentsByClinicIdParamsValidationPipe) params: FetchAppointmentsByClinicIdParamsSchema) {
		const { clinicId } = params;

		const result = await this.fetchAppointmentsByClinicIdUseCase.execute({ clinicId });

		const { appointments, patients, professionals, users } = unwrapEither(result);

		return appointments.map((appointment) => {
			const patient = patients.get(appointment.patientId.toString());
			const professional = professionals.get(appointment.professionalId.toString());
			const user = professional ? users.get(professional.userId.toString()) : null;
			
			return AppointmentPresenter.toHTTP(appointment, patient, user);
		});
	}
}



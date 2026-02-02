import { unwrapEither } from "@/shared/either/either";
import { FetchAppointmentsByPatientIdUseCase } from "@/domain/application/use-cases/appointment/fetch-appointments-by-patient-id";
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

const fetchAppointmentsByPatientIdParamsSchema = z.object({
	patientId: z.string(),
});

type FetchAppointmentsByPatientIdParamsSchema = z.infer<typeof fetchAppointmentsByPatientIdParamsSchema>;

const fetchAppointmentsByPatientIdParamsValidationPipe = new ZodValidationPipe(fetchAppointmentsByPatientIdParamsSchema);

@ApiTags("Appointments")
@Controller("/patients")
export class FetchAppointmentsByPatientIdController {
	constructor(private readonly fetchAppointmentsByPatientIdUseCase: FetchAppointmentsByPatientIdUseCase) {}

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
	async handle(@Param(fetchAppointmentsByPatientIdParamsValidationPipe) params: FetchAppointmentsByPatientIdParamsSchema) {
		const { patientId } = params;

		const result = await this.fetchAppointmentsByPatientIdUseCase.execute({ patientId });

		const { appointments } = unwrapEither(result);

		return appointments.map(AppointmentPresenter.toHTTP);
	}
}

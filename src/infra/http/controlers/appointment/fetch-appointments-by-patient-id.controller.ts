import { unwrapEither } from "@/core/either/either";
import { FetchAppointmentsByPatientIdUseCase } from "@/domain/application/use-cases/appointment/fetch-appointments-by-patient-id";
import { Controller, Get, Param, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { AppointmentPresenter } from "../../presenters/appointment-presenter";

const fetchAppointmentsByPatientIdParamsSchema = z.object({
	patientId: z.string(),
});

type FetchAppointmentsByPatientIdParamsSchema = z.infer<typeof fetchAppointmentsByPatientIdParamsSchema>;

const fetchAppointmentsByPatientIdParamsValidationPipe = new ZodValidationPipe(fetchAppointmentsByPatientIdParamsSchema);

@Controller("/patients")
export class FetchAppointmentsByPatientIdController {
	constructor(private readonly fetchAppointmentsByPatientIdUseCase: FetchAppointmentsByPatientIdUseCase) {}

	@Get("/:patientId/appointments")
	async handle(@Param(fetchAppointmentsByPatientIdParamsValidationPipe) params: FetchAppointmentsByPatientIdParamsSchema) {
		const { patientId } = params;

		const result = await this.fetchAppointmentsByPatientIdUseCase.execute({ patientId });

		const { appointments } = unwrapEither(result);

		return appointments.map(AppointmentPresenter.toHTTP);
	}
}

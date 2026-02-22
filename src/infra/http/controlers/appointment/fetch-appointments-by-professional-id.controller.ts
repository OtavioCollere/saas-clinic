import { unwrapEither } from "@/shared/either/either";
import { FetchAppointmentsByProfessionalIdUseCase } from "@/domain/application/use-cases/appointment/fetch-appointments-by-professional-id";
import {
	Controller,
	Get,
	Inject,
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

const fetchAppointmentsByProfessionalIdParamsSchema = z.object({
	professionalId: z.string(),
});

type FetchAppointmentsByProfessionalIdParamsSchema = z.infer<typeof fetchAppointmentsByProfessionalIdParamsSchema>;

const fetchAppointmentsByProfessionalIdParamsValidationPipe = new ZodValidationPipe(fetchAppointmentsByProfessionalIdParamsSchema);

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
	async handle(@Param(fetchAppointmentsByProfessionalIdParamsValidationPipe) params: FetchAppointmentsByProfessionalIdParamsSchema) {
		const { professionalId } = params;

		const result = await this.fetchAppointmentsByProfessionalIdUseCase.execute({ professionalId });

		const { appointments } = unwrapEither(result);

		return appointments.map(AppointmentPresenter.toHTTP);
	}
}

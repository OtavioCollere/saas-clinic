import { Inject } from "@nestjs/common";
import { isLeft, unwrapEither } from "@/shared/either/either";
import { AppointmentNotFoundError } from "@/shared/errors/appointment-not-found-error";
import { GetAppointmentByIdUseCase } from "@/domain/application/use-cases/appointment/get-appointment-by-id";
import {
	Controller,
	Get,
	NotFoundException,
	Param,
} from "@nestjs/common";
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { AppointmentPresenter } from "../../presenters/appointment-presenter";

const getAppointmentByIdParamsSchema = z.object({
	id: z.string(),
});

type GetAppointmentByIdParamsSchema = z.infer<typeof getAppointmentByIdParamsSchema>;

const getAppointmentByIdParamsValidationPipe = new ZodValidationPipe(getAppointmentByIdParamsSchema);

@ApiTags("Appointments")
@Controller("/appointments")
export class GetAppointmentByIdController {
	constructor(
		@Inject(GetAppointmentByIdUseCase)
		private readonly getAppointmentByIdUseCase: GetAppointmentByIdUseCase
	) {}

	@Get("/:id")
	@ApiOperation({
		summary: "Get appointment by ID",
		description: "Retrieves a specific appointment by its ID.",
	})
	@ApiParam({
		name: "id",
		type: String,
		description: "Appointment identifier",
	})
	@ApiOkResponse({
		description: "Appointment retrieved successfully",
	})
	@ApiNotFoundResponse({
		description: "Appointment not found",
	})
	async handle(@Param(getAppointmentByIdParamsValidationPipe) params: GetAppointmentByIdParamsSchema) {
		const { id } = params;

		const result = await this.getAppointmentByIdUseCase.execute({ appointmentId: id });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case AppointmentNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { appointment, patient, user } = unwrapEither(result);

		return AppointmentPresenter.toHTTP(appointment, patient ?? undefined, user);
	}
}


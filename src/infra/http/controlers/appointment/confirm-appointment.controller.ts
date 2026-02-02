import { isLeft, unwrapEither } from "@/shared/either/either";
import { AppointmentNotFoundError } from "@/shared/errors/appointment-not-found-error";
import { PatientNotFoundError } from "@/shared/errors/patient-not-found-error";
import { AppointmentNotWaitingError } from "@/shared/errors/appointment-not-waiting-error";
import { ConfirmAppointmentUseCase } from "@/domain/application/use-cases/appointment/confirm-appointment";
import {
	BadRequestException,
	Body,
	Controller,
	NotFoundException,
	Param,
	Patch,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { AppointmentPresenter } from "../../presenters/appointment-presenter";

const confirmAppointmentParamsSchema = z.object({
	appointmentId: z.string(),
});

const confirmAppointmentBodySchema = z.object({
	patientId: z.string(),
});

type ConfirmAppointmentParamsSchema = z.infer<typeof confirmAppointmentParamsSchema>;
type ConfirmAppointmentBodySchema = z.infer<typeof confirmAppointmentBodySchema>;

const confirmAppointmentParamsValidationPipe = new ZodValidationPipe(confirmAppointmentParamsSchema);
const confirmAppointmentBodyValidationPipe = new ZodValidationPipe(confirmAppointmentBodySchema);

@ApiTags("Appointments")
@Controller("/appointments")
export class ConfirmAppointmentController {
	constructor(private readonly confirmAppointmentUseCase: ConfirmAppointmentUseCase) {}

	@Patch("/:appointmentId/confirm")
	@ApiOperation({
		summary: "Confirm appointment",
		description: "Confirms a waiting appointment.",
	})
	@ApiParam({
		name: "appointmentId",
		type: String,
		description: "Appointment identifier",
	})
	@ApiOkResponse({
		description: "Appointment confirmed successfully",
	})
	@ApiNotFoundResponse({
		description: "Appointment or patient not found",
	})
	@ApiBadRequestResponse({
		description: "Appointment is not in waiting status",
	})
	async handle(
		@Param(confirmAppointmentParamsValidationPipe) params: ConfirmAppointmentParamsSchema,
		@Body(confirmAppointmentBodyValidationPipe) body: ConfirmAppointmentBodySchema
	) {
		const { appointmentId } = params;
		const { patientId } = body;

		const result = await this.confirmAppointmentUseCase.execute({ appointmentId, patientId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case AppointmentNotFoundError:
					throw new NotFoundException(error.message);
				case PatientNotFoundError:
					throw new NotFoundException(error.message);
				case AppointmentNotWaitingError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { appointment } = unwrapEither(result);

		return AppointmentPresenter.toHTTP(appointment);
	}
}

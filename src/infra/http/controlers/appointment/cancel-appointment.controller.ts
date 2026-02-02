import { isLeft, unwrapEither } from "@/shared/either/either";
import { AppointmentNotFoundError } from "@/shared/errors/appointment-not-found-error";
import { AppointmentNotWaitingError } from "@/shared/errors/appointment-not-waiting-error";
import { CancelAppointmentUseCase } from "@/domain/application/use-cases/appointment/cancel-appointment";
import {
	BadRequestException,
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

const cancelAppointmentParamsSchema = z.object({
	appointmentId: z.string(),
});

type CancelAppointmentParamsSchema = z.infer<typeof cancelAppointmentParamsSchema>;

const cancelAppointmentParamsValidationPipe = new ZodValidationPipe(cancelAppointmentParamsSchema);

@ApiTags("Appointments")
@Controller("/appointments")
export class CancelAppointmentController {
	constructor(private readonly cancelAppointmentUseCase: CancelAppointmentUseCase) {}

	@Patch("/:appointmentId/cancel")
	@ApiOperation({
		summary: "Cancel appointment",
		description: "Cancels a waiting appointment.",
	})
	@ApiParam({
		name: "appointmentId",
		type: String,
		description: "Appointment identifier",
	})
	@ApiOkResponse({
		description: "Appointment canceled successfully",
	})
	@ApiNotFoundResponse({
		description: "Appointment not found",
	})
	@ApiBadRequestResponse({
		description: "Appointment is not in waiting status",
	})
	async handle(@Param(cancelAppointmentParamsValidationPipe) params: CancelAppointmentParamsSchema) {
		const { appointmentId } = params;

		const result = await this.cancelAppointmentUseCase.execute({ appointmentId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case AppointmentNotFoundError:
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

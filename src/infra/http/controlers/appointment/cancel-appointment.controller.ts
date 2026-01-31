import { isLeft, unwrapEither } from "@/shared/either/either";
import { AppointmentNotFoundError } from "@/shared/errors/appointment-not-found-error";
import { DomainError } from "@/shared/errors/domain-error";
import { CancelAppointmentUseCase } from "@/domain/application/use-cases/appointment/cancel-appointment";
import { BadRequestException, Controller, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { AppointmentPresenter } from "../../presenters/appointment-presenter";

const cancelAppointmentParamsSchema = z.object({
	appointmentId: z.string(),
});

type CancelAppointmentParamsSchema = z.infer<typeof cancelAppointmentParamsSchema>;

const cancelAppointmentParamsValidationPipe = new ZodValidationPipe(cancelAppointmentParamsSchema);

@Controller("/appointments")
export class CancelAppointmentController {
	constructor(private readonly cancelAppointmentUseCase: CancelAppointmentUseCase) {}

	@Patch("/:appointmentId/cancel")
	async handle(@Param(cancelAppointmentParamsValidationPipe) params: CancelAppointmentParamsSchema) {
		const { appointmentId } = params;

		const result = await this.cancelAppointmentUseCase.execute({ appointmentId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case AppointmentNotFoundError:
					throw new NotFoundException(error.message);
				case DomainError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { appointment } = unwrapEither(result);

		return AppointmentPresenter.toHTTP(appointment);
	}
}

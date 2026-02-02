import { isLeft, unwrapEither } from "@/shared/either/either";
import { ClinicHasPendingAppointmentsError } from "@/shared/errors/clinic-has-pending-appointments-error";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { UserIsNotOwnerError } from "@/shared/errors/user-is-not-owner-error";
import { InactivateClinicUseCase } from "@/domain/application/use-cases/clinic/inactivate-clinic";
import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	NotFoundException,
	Param,
	Patch,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ClinicPresenter } from "../../presenters/clinic-presenter";

const inactivateClinicBodySchema = z.object({
	userId: z.string(),
});

const inactivateClinicParamsSchema = z.object({
	clinicId: z.string(),
});

type InactivateClinicBodySchema = z.infer<typeof inactivateClinicBodySchema>;
type InactivateClinicParamsSchema = z.infer<typeof inactivateClinicParamsSchema>;

const inactivateClinicBodyValidationPipe = new ZodValidationPipe(inactivateClinicBodySchema);
const inactivateClinicParamsValidationPipe = new ZodValidationPipe(inactivateClinicParamsSchema);

@ApiTags("Clinics")
@Controller("/clinics")
export class InactivateClinicController {
	constructor(private readonly inactivateClinicUseCase: InactivateClinicUseCase) {}

	@Patch("/:clinicId/inactivate")
	@ApiOperation({
		summary: "Inactivate clinic",
		description: "Inactivates a clinic if the authenticated user is the clinic owner and there are no pending appointments.",
	})
	@ApiParam({
		name: "clinicId",
		type: String,
		description: "Clinic identifier",
	})
	@ApiOkResponse({
		description: "Clinic inactivated successfully",
	})
	@ApiForbiddenResponse({
		description: "User is not the clinic owner",
	})
	@ApiNotFoundResponse({
		description: "Clinic not found",
	})
	@ApiBadRequestResponse({
		description: "Clinic has pending appointments",
	})
	async handle(
		@Param(inactivateClinicParamsValidationPipe) params: InactivateClinicParamsSchema,
		@Body(inactivateClinicBodyValidationPipe) body: InactivateClinicBodySchema,
	) {
		const { clinicId } = params;
		const { userId } = body;

		const result = await this.inactivateClinicUseCase.execute({
			clinicId,
			userId,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ClinicNotFoundError:
					throw new NotFoundException(error.message);
				case UserIsNotOwnerError:
					throw new ForbiddenException(error.message);
				case ClinicHasPendingAppointmentsError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { clinic } = unwrapEither(result);

		return ClinicPresenter.toHTTP(clinic);
	}
}

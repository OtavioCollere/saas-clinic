import { isLeft, unwrapEither } from "@/core/either/either";
import { ClinicNotFoundError } from "@/core/errors/clinic-not-found-error";
import { UserIsNotOwnerError } from "@/core/errors/user-is-not-owner-error";
import type { ActivateClinicUseCase } from "@/domain/application/use-cases/clinic/activate-clinic";
import { Body, Controller, ForbiddenException, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ClinicPresenter } from "../presenters/clinic-presenter";

const activateClinicBodySchema = z.object({
	userId: z.string(),
});

const activateClinicParamsSchema = z.object({
	clinicId: z.string(),
});

type ActivateClinicBodySchema = z.infer<typeof activateClinicBodySchema>;
type ActivateClinicParamsSchema = z.infer<typeof activateClinicParamsSchema>;

const activateClinicBodyValidationPipe = new ZodValidationPipe(activateClinicBodySchema);
const activateClinicParamsValidationPipe = new ZodValidationPipe(activateClinicParamsSchema);

@Controller("/clinics")
export class ActivateClinicController {
	constructor(private readonly activateClinicUseCase: ActivateClinicUseCase) {}

	@Patch("/:clinicId/activate")
	async handle(
		@Param(activateClinicParamsValidationPipe) params: ActivateClinicParamsSchema,
		@Body(activateClinicBodyValidationPipe) body: ActivateClinicBodySchema,
	) {
		const { clinicId } = params;
		const { userId } = body;

		const result = await this.activateClinicUseCase.execute({
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
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { clinic } = unwrapEither(result);

		return ClinicPresenter.toHTTP(clinic);
	}
}

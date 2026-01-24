import { isLeft, unwrapEither } from "@/core/either/either";
import { FranchiseHasPendingAppointmentsError } from "@/core/errors/franchise-has-pending-appointments-error";
import { FranchiseNotFoundError } from "@/core/errors/franchise-not-found-error";
import { UserIsNotOwnerError } from "@/core/errors/user-is-not-owner-error";
import type { InactivateFranchiseUseCase } from "@/domain/application/use-cases/franchise/inactivate-franchise";
import { BadRequestException, Body, Controller, ForbiddenException, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { FranchisePresenter } from "../../presenters/franchise-presenter";

const inactivateFranchiseBodySchema = z.object({
	userId: z.string(),
});

const inactivateFranchiseParamsSchema = z.object({
	franchiseId: z.string(),
});

type InactivateFranchiseBodySchema = z.infer<typeof inactivateFranchiseBodySchema>;
type InactivateFranchiseParamsSchema = z.infer<typeof inactivateFranchiseParamsSchema>;

const inactivateFranchiseBodyValidationPipe = new ZodValidationPipe(inactivateFranchiseBodySchema);
const inactivateFranchiseParamsValidationPipe = new ZodValidationPipe(inactivateFranchiseParamsSchema);

@Controller("/franchises")
export class InactivateFranchiseController {
	constructor(private readonly inactivateFranchiseUseCase: InactivateFranchiseUseCase) {}

	@Patch("/:franchiseId/inactivate")
	async handle(
		@Param(inactivateFranchiseParamsValidationPipe) params: InactivateFranchiseParamsSchema,
		@Body(inactivateFranchiseBodyValidationPipe) body: InactivateFranchiseBodySchema,
	) {
		const { franchiseId } = params;
		const { userId } = body;

		const result = await this.inactivateFranchiseUseCase.execute({
			franchiseId,
			userId,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case FranchiseNotFoundError:
					throw new NotFoundException(error.message);
				case UserIsNotOwnerError:
					throw new ForbiddenException(error.message);
				case FranchiseHasPendingAppointmentsError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { franchise } = unwrapEither(result);

		return FranchisePresenter.toHTTP(franchise);
	}
}

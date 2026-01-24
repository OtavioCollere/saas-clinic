import { isLeft, unwrapEither } from "@/core/either/either";
import { ClinicNotFoundError } from "@/core/errors/clinic-not-found-error";
import { UserIsNotOwnerError } from "@/core/errors/user-is-not-owner-error";
import type { RegisterFranchiseUseCase } from "@/domain/application/use-cases/franchise/register-franchise";
import { Body, Controller, ForbiddenException, NotFoundException, Param, Post, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { FranchisePresenter } from "../../presenters/franchise-presenter";

const registerFranchiseBodySchema = z.object({
	userId: z.string(),
	name: z.string(),
	address: z.string(),
	zipCode: z.string(),
	description: z.string().optional(),
});

const registerFranchiseParamsSchema = z.object({
	clinicId: z.string(),
});

type RegisterFranchiseBodySchema = z.infer<typeof registerFranchiseBodySchema>;
type RegisterFranchiseParamsSchema = z.infer<typeof registerFranchiseParamsSchema>;

const registerFranchiseBodyValidationPipe = new ZodValidationPipe(registerFranchiseBodySchema);
const registerFranchiseParamsValidationPipe = new ZodValidationPipe(registerFranchiseParamsSchema);

@Controller("/clinics")
export class RegisterFranchiseController {
	constructor(private readonly registerFranchiseUseCase: RegisterFranchiseUseCase) {}

	@Post("/:clinicId/franchises")
	async handle(
		@Param(registerFranchiseParamsValidationPipe) params: RegisterFranchiseParamsSchema,
		@Body(registerFranchiseBodyValidationPipe) body: RegisterFranchiseBodySchema,
	) {
		const { clinicId } = params;
		const { userId, name, address, zipCode, description } = body;

		const result = await this.registerFranchiseUseCase.execute({
			clinicId,
			userId,
			name,
			address,
			zipCode,
			description,
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

		const { franchise } = unwrapEither(result);

		return FranchisePresenter.toHTTP(franchise);
	}
}

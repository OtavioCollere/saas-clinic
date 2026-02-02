import { isLeft, unwrapEither } from "@/shared/either/either";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { UserIsNotOwnerError } from "@/shared/errors/user-is-not-owner-error";
import { RegisterFranchiseUseCase } from "@/domain/application/use-cases/franchise/register-franchise";
import {
	Body,
	Controller,
	ForbiddenException,
	NotFoundException,
	Param,
	Post,
} from "@nestjs/common";
import {
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
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

@ApiTags("Franchises")
@Controller("/clinics")
export class RegisterFranchiseController {
	constructor(private readonly registerFranchiseUseCase: RegisterFranchiseUseCase) {}

	@Post("/:clinicId/franchises")
	@ApiOperation({
		summary: "Register franchise",
		description: "Creates a new franchise for a clinic if the authenticated user is the clinic owner.",
	})
	@ApiParam({
		name: "clinicId",
		type: String,
		description: "Clinic identifier",
	})
	@ApiOkResponse({
		description: "Franchise created successfully",
	})
	@ApiForbiddenResponse({
		description: "User is not the clinic owner",
	})
	@ApiNotFoundResponse({
		description: "Clinic not found",
	})
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

import { isLeft, unwrapEither } from "@/shared/either/either";
import { FranchiseNotFoundError } from "@/shared/errors/franchise-not-found-error";
import { UserIsNotOwnerError } from "@/shared/errors/user-is-not-owner-error";
import { EditFranchiseUseCase } from "@/domain/application/use-cases/franchise/edit-franchise";
import {
	Body,
	Controller,
	ForbiddenException,
	NotFoundException,
	Param,
	Patch,
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

const editFranchiseBodySchema = z.object({
	userId: z.string(),
	name: z.string().optional(),
	address: z.string().optional(),
	zipCode: z.string().optional(),
	description: z.string().optional(),
});

const editFranchiseParamsSchema = z.object({
	franchiseId: z.string(),
});

type EditFranchiseBodySchema = z.infer<typeof editFranchiseBodySchema>;
type EditFranchiseParamsSchema = z.infer<typeof editFranchiseParamsSchema>;

const editFranchiseBodyValidationPipe = new ZodValidationPipe(editFranchiseBodySchema);
const editFranchiseParamsValidationPipe = new ZodValidationPipe(editFranchiseParamsSchema);

@ApiTags("Franchises")
@Controller("/franchises")
export class EditFranchiseController {
	constructor(private readonly editFranchiseUseCase: EditFranchiseUseCase) {}

	@Patch("/:franchiseId")
	@ApiOperation({
		summary: "Edit franchise",
		description: "Updates franchise information if the authenticated user is the clinic owner.",
	})
	@ApiParam({
		name: "franchiseId",
		type: String,
		description: "Franchise identifier",
	})
	@ApiOkResponse({
		description: "Franchise updated successfully",
	})
	@ApiForbiddenResponse({
		description: "User is not the clinic owner",
	})
	@ApiNotFoundResponse({
		description: "Franchise not found",
	})
	async handle(
		@Param(editFranchiseParamsValidationPipe) params: EditFranchiseParamsSchema,
		@Body(editFranchiseBodyValidationPipe) body: EditFranchiseBodySchema,
	) {
		const { franchiseId } = params;
		const { userId, name, address, zipCode, description } = body;

		const result = await this.editFranchiseUseCase.execute({
			franchiseId,
			userId,
			name,
			address,
			zipCode,
			description,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case FranchiseNotFoundError:
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

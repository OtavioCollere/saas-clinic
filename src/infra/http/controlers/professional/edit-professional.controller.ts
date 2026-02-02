import { isLeft, unwrapEither } from "@/shared/either/either";
import { ProfessionalNotFoundError } from "@/shared/errors/professional-not-found-error";
import { UserIsNotOwnerError } from "@/shared/errors/user-is-not-owner-error";
import { EditProfessionalUseCase } from "@/domain/application/use-cases/professional/edit-professional";
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
import { ProfessionalPresenter } from "../../presenters/professional-presenter";

const editProfessionalBodySchema = z.object({
	editorId: z.string(),
	council: z.string().optional(),
	councilNumber: z.string().optional(),
	councilState: z.string().optional(),
	profession: z.string().optional(),
});

const editProfessionalParamsSchema = z.object({
	professionalId: z.string(),
});

type EditProfessionalBodySchema = z.infer<typeof editProfessionalBodySchema>;
type EditProfessionalParamsSchema = z.infer<typeof editProfessionalParamsSchema>;

const editProfessionalBodyValidationPipe = new ZodValidationPipe(editProfessionalBodySchema);
const editProfessionalParamsValidationPipe = new ZodValidationPipe(editProfessionalParamsSchema);

@ApiTags("Professionals")
@Controller("/professionals")
export class EditProfessionalController {
	constructor(private readonly editProfessionalUseCase: EditProfessionalUseCase) {}

	@Patch("/:professionalId")
	@ApiOperation({
		summary: "Edit professional",
		description: "Updates professional information if the authenticated user is the clinic owner.",
	})
	@ApiParam({
		name: "professionalId",
		type: String,
		description: "Professional identifier",
	})
	@ApiOkResponse({
		description: "Professional updated successfully",
	})
	@ApiForbiddenResponse({
		description: "User is not the clinic owner",
	})
	@ApiNotFoundResponse({
		description: "Professional not found",
	})
	@ApiBadRequestResponse({
		description: "Invalid request data",
	})
	async handle(
		@Param(editProfessionalParamsValidationPipe) params: EditProfessionalParamsSchema,
		@Body(editProfessionalBodyValidationPipe) body: EditProfessionalBodySchema,
	) {
		const { professionalId } = params;
		const { editorId, council, councilNumber, councilState, profession } = body;

		const result = await this.editProfessionalUseCase.execute({
			professionalId,
			editorId,
			council,
			councilNumber,
			councilState,
			profession,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ProfessionalNotFoundError:
					throw new NotFoundException(error.message);
				case UserIsNotOwnerError:
					throw new ForbiddenException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { professional } = unwrapEither(result);

		return ProfessionalPresenter.toHTTP(professional);
	}
}

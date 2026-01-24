import { isLeft, unwrapEither } from "@/core/either/either";
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";
import { UserIsNotOwnerError } from "@/core/errors/user-is-not-owner-error";
import type { EditProfessionalUseCase } from "@/domain/application/use-cases/professional/edit-professional";
import { BadRequestException, Body, Controller, ForbiddenException, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
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

@Controller("/professionals")
export class EditProfessionalController {
	constructor(private readonly editProfessionalUseCase: EditProfessionalUseCase) {}

	@Patch("/:professionalId")
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

import { isLeft, unwrapEither } from "@/core/either/either";
import { ClinicAlreadyExistsError } from "@/core/errors/clinic-already-exists-error";
import { ClinicNotFoundError } from "@/core/errors/clinic-not-found-error";
import { UserIsNotOwnerError } from "@/core/errors/user-is-not-owner-error";
import type { EditClinicUseCase } from "@/domain/application/use-cases/clinic/edit-clinic";
import { BadRequestException, Body, Controller, ForbiddenException, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ClinicPresenter } from "../../presenters/clinic-presenter";

const editClinicBodySchema = z.object({
	editorId: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	avatarUrl: z.string().optional(),
});

const editClinicParamsSchema = z.object({
	clinicId: z.string(),
});

type EditClinicBodySchema = z.infer<typeof editClinicBodySchema>;
type EditClinicParamsSchema = z.infer<typeof editClinicParamsSchema>;

const editClinicBodyValidationPipe = new ZodValidationPipe(editClinicBodySchema);
const editClinicParamsValidationPipe = new ZodValidationPipe(editClinicParamsSchema);

@Controller("/clinics")
export class EditClinicController {
	constructor(private readonly editClinicUseCase: EditClinicUseCase) {}

	@Patch("/:clinicId")
	async handle(
		@Param(editClinicParamsValidationPipe) params: EditClinicParamsSchema,
		@Body(editClinicBodyValidationPipe) body: EditClinicBodySchema,
	) {
		const { clinicId } = params;
		const { editorId, name, description, avatarUrl } = body;

		const result = await this.editClinicUseCase.execute({
			clinicId,
			editorId,
			name,
			description,
			avatarUrl,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ClinicNotFoundError:
					throw new NotFoundException(error.message);
				case UserIsNotOwnerError:
					throw new ForbiddenException(error.message);
				case ClinicAlreadyExistsError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { clinic } = unwrapEither(result);

		return ClinicPresenter.toHTTP(clinic);
	}
}

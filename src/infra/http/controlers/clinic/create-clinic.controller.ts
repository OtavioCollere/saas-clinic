import { isLeft, unwrapEither } from "@/core/either/either";
import { ClinicAlreadyExistsError } from "@/core/errors/clinic-already-exists-error";
import { OwnerNotFoundError } from "@/core/errors/owner-not-found-error";
import { CreateClinicUseCase } from "@/domain/application/use-cases/clinic/create-clinic";
import { BadRequestException, Body, Controller, NotFoundException, Post, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ClinicPresenter } from "../../presenters/clinic-presenter";

const createClinicBodySchema = z.object({
	name: z.string(),
	ownerId: z.string(),
	description: z.string().optional(),
	avatarUrl: z.string().optional(),
});

type CreateClinicBodySchema = z.infer<typeof createClinicBodySchema>;

const createClinicBodyValidationPipe = new ZodValidationPipe(createClinicBodySchema);

@Controller("/clinics")
export class CreateClinicController {
	constructor(private readonly createClinicUseCase: CreateClinicUseCase) {}

	@Post()
	@UsePipes(createClinicBodyValidationPipe)
	async handle(@Body() body: CreateClinicBodySchema) {
		const { name, ownerId, description, avatarUrl } = body;

		const result = await this.createClinicUseCase.execute({
			name,
			ownerId,
			description,
			avatarUrl,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case OwnerNotFoundError:
					throw new NotFoundException(error.message);
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

import { isLeft, unwrapEither } from "@/shared/either/either";
import { ClinicAlreadyExistsError } from "@/shared/errors/clinic-already-exists-error";
import { OwnerNotFoundError } from "@/shared/errors/owner-not-found-error";
import { InvalidCnpjError } from "@/shared/errors/invalid-cnpj-error";
import { CnpjAlreadyExistsError } from "@/shared/errors/cnpj-already-exists-error";
import { CreateClinicUseCase } from "@/domain/application/use-cases/clinic/create-clinic";
import {
	BadRequestException,
	Body,
	Controller,
	NotFoundException,
	Post,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ClinicPresenter } from "../../presenters/clinic-presenter";

const createClinicBodySchema = z.object({
	name: z.string(),
	ownerId: z.string(),
	cnpj: z.string(),
	description: z.string().optional(),
	avatarUrl: z.string().optional(),
});

type CreateClinicBodySchema = z.infer<typeof createClinicBodySchema>;

const createClinicBodyValidationPipe = new ZodValidationPipe(createClinicBodySchema);

@ApiTags("Clinics")
@Controller("/clinics")
export class CreateClinicController {
	constructor(private readonly createClinicUseCase: CreateClinicUseCase) {}

	@Post()
	@ApiOperation({
		summary: "Create clinic",
		description: "Creates a new clinic with the provided owner.",
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				name: { type: 'string', example: 'Clínica Estética' },
				ownerId: { type: 'string', example: 'user-id' },
				cnpj: { type: 'string', example: '12345678000190' },
				description: { type: 'string', example: 'Clínica especializada em estética' },
				avatarUrl: { type: 'string', example: 'https://example.com/avatar.jpg' },
			},
			required: ['name', 'ownerId', 'cnpj'],
		},
	})
	@ApiOkResponse({
		description: "Clinic created successfully",
	})
	@ApiNotFoundResponse({
		description: "Owner not found",
	})
	@ApiBadRequestResponse({
		description: "Invalid request data, invalid CNPJ, CNPJ already exists, or clinic already exists",
	})
	async handle(@Body(createClinicBodyValidationPipe) body: CreateClinicBodySchema) {
		const { name, ownerId, cnpj, description, avatarUrl } = body;

		const result = await this.createClinicUseCase.execute({
			name,
			ownerId,
			cnpj,
			description,
			avatarUrl,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case OwnerNotFoundError:
					throw new NotFoundException(error.message);
				case InvalidCnpjError:
				case CnpjAlreadyExistsError:
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

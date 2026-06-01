import { isLeft, unwrapEither } from "@/shared/either/either";
import { PatientNotFoundError } from "@/shared/errors/patient-not-found-error";
import { CreateAnamnesisUseCase } from "@/domain/application/use-cases/anamnesis/create-anamnesis";
import { AESTHETIC_REGIONS } from "@/domain/enterprise/value-objects/aesthetic-region";
import {
	Body,
	Controller,
	Inject,
	NotFoundException,
	Param,
	Post,
} from "@nestjs/common";
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { AnamnesisPresenter } from "../../presenters/anamnesis-presenter";

const regionEnum = z.enum(AESTHETIC_REGIONS as unknown as [string, ...string[]]).optional();

const createAnamnesisParamsSchema = z.object({
	patientId: z.string(),
});

const createAnamnesisBodySchema = z.object({
	aestheticHistory: z.object({
		hadPreviousAestheticTreatment: z.boolean(),
		botulinumToxin: z.boolean(),
		botulinumRegion: regionEnum,
		filler: z.boolean(),
		fillerRegion: regionEnum,
		fillerProduct: z.string().optional(),
		suspensionThreads: z.boolean(),
		suspensionThreadsRegion: regionEnum,
		suspensionThreadsProduct: z.string().optional(),
		surgicalLift: z.boolean(),
		surgicalLiftRegion: regionEnum,
		surgicalLiftProduct: z.string().optional(),
		chemicalPeeling: z.boolean(),
		chemicalPeelingRegion: regionEnum,
		chemicalPeelingProduct: z.string().optional(),
		laser: z.boolean(),
		laserRegion: regionEnum,
		laserProduct: z.string().optional(),
		exposedToHeatOrColdWork: z.boolean(),
	}),
	healthConditions: z.any(),
	medicalHistory: z.any(),
	physicalAssessment: z.object({
		bloodPressure: z.string().min(1),
		height: z.number().positive(),
		initialWeight: z.number().positive(),
		finalWeight: z.number().positive().optional(),
	}),
	patientSignature: z.string().optional(),
});

type CreateAnamnesisParamsSchema = z.infer<typeof createAnamnesisParamsSchema>;
type CreateAnamnesisBodySchema = z.infer<typeof createAnamnesisBodySchema>;

const createAnamnesisParamsValidationPipe = new ZodValidationPipe(createAnamnesisParamsSchema);
const createAnamnesisBodyValidationPipe = new ZodValidationPipe(createAnamnesisBodySchema);

@ApiTags("Anamnesis")
@Controller("/patients")
export class CreateAnamnesisController {
	constructor(
		@Inject(CreateAnamnesisUseCase)
		private readonly createAnamnesisUseCase: CreateAnamnesisUseCase,
	) {}

	@Post("/:patientId/anamnesis")
	@ApiOperation({
		summary: "Create anamnesis",
		description: "Creates an anamnesis record for a patient.",
	})
	@ApiParam({
		name: "patientId",
		type: String,
		description: "Patient identifier",
	})
	@ApiOkResponse({
		description: "Anamnesis created successfully",
	})
	@ApiNotFoundResponse({
		description: "Patient not found",
	})
	async handle(
		@Param(createAnamnesisParamsValidationPipe) params: CreateAnamnesisParamsSchema,
		@Body(createAnamnesisBodyValidationPipe) body: CreateAnamnesisBodySchema
	) {
		const { patientId } = params;
		const { aestheticHistory, healthConditions, medicalHistory, physicalAssessment, patientSignature } = body;

		const result = await this.createAnamnesisUseCase.execute({
			patientId,
			aestheticHistory,
			healthConditions,
			medicalHistory,
			physicalAssessment,
			patientSignature,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case PatientNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { anamnesis } = unwrapEither(result);

		return AnamnesisPresenter.toHTTP(anamnesis);
	}
}

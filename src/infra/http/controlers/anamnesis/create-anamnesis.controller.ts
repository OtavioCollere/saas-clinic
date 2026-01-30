import { isLeft, unwrapEither } from "@/core/either/either";
import { PatientNotFoundError } from "@/core/errors/patient-not-found-error";
import { CreateAnamnesisUseCase } from "@/domain/application/use-cases/anamnesis/create-anamnesis";
import { Body, Controller, NotFoundException, Param, Post, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { AnamnesisPresenter } from "../../presenters/anamnesis-presenter";

const createAnamnesisParamsSchema = z.object({
	patientId: z.string(),
});

const createAnamnesisBodySchema = z.object({
	aestheticHistory: z.any(),
	healthConditions: z.any(),
	medicalHistory: z.any(),
	physicalAssessment: z.any(),
});

type CreateAnamnesisParamsSchema = z.infer<typeof createAnamnesisParamsSchema>;
type CreateAnamnesisBodySchema = z.infer<typeof createAnamnesisBodySchema>;

const createAnamnesisParamsValidationPipe = new ZodValidationPipe(createAnamnesisParamsSchema);
const createAnamnesisBodyValidationPipe = new ZodValidationPipe(createAnamnesisBodySchema);

@Controller("/patients")
export class CreateAnamnesisController {
	constructor(private readonly createAnamnesisUseCase: CreateAnamnesisUseCase) {}

	@Post("/:patientId/anamnesis")
	async handle(
		@Param(createAnamnesisParamsValidationPipe) params: CreateAnamnesisParamsSchema,
		@Body(createAnamnesisBodyValidationPipe) body: CreateAnamnesisBodySchema
	) {
		const { patientId } = params;
		const { aestheticHistory, healthConditions, medicalHistory, physicalAssessment } = body;

		const result = await this.createAnamnesisUseCase.execute({
			patientId,
			aestheticHistory,
			healthConditions,
			medicalHistory,
			physicalAssessment,
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

import { Inject } from "@nestjs/common";
import { isLeft, unwrapEither } from "@/shared/either/either";
import { FranchiseNotFoundError } from "@/shared/errors/franchise-not-found-error";
import { CreateProcedureUseCase } from "@/domain/application/use-cases/procedure/create-procedure";
import { FranchiseRepository } from "@/domain/application/repositories/franchise-repository";
import {
	Body,
	Controller,
	NotFoundException,
	Post,
} from "@nestjs/common";
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ProcedurePresenter } from "../../presenters/procedure-presenter";

const createProcedureBodySchema = z.object({
	franchiseId: z.string().optional(),
	name: z.string(),
	price: z.number().positive(),
	notes: z.string().optional(),
	createForAllFranchises: z.boolean().optional().default(false),
	clinicId: z.string().optional(),
}).refine(
	(data) => {
		if (data.createForAllFranchises) {
			return !!data.clinicId;
		}
		return !!data.franchiseId;
	},
	{
		message: "Either franchiseId (for single franchise) or clinicId with createForAllFranchises=true must be provided",
		path: ["franchiseId"],
	}
);

type CreateProcedureBodySchema = z.infer<typeof createProcedureBodySchema>;

const createProcedureBodyValidationPipe = new ZodValidationPipe(createProcedureBodySchema);

@ApiTags("Procedures")
@Controller("/procedures")
export class CreateProcedureController {
	constructor(
		@Inject(CreateProcedureUseCase)
		private readonly createProcedureUseCase: CreateProcedureUseCase,
		@Inject(FranchiseRepository)
		private readonly franchiseRepository: FranchiseRepository
	) {}

	@Post()
	@ApiOperation({
		summary: "Create procedure",
		description: "Creates a new procedure for a franchise or all franchises.",
	})
	@ApiOkResponse({
		description: "Procedure created successfully",
	})
	@ApiNotFoundResponse({
		description: "Franchise not found",
	})
	async handle(@Body(createProcedureBodyValidationPipe) body: CreateProcedureBodySchema) {
		const { franchiseId, name, price, notes, createForAllFranchises, clinicId } = body;

		// Se criar para todas as franquias
		if (createForAllFranchises && clinicId) {
			const franchises = await this.franchiseRepository.findByClinicId(clinicId);
			
			if (franchises.length === 0) {
				throw new NotFoundException("No franchises found for this clinic");
			}

			const createdProcedures: Array<{
				id: string;
				franchiseId: string;
				name: string;
				price: number;
				notes: string | undefined;
				status: string;
				createdAt: string;
				updatedAt: string | undefined;
			}> = [];

			for (const franchise of franchises) {
				const result = await this.createProcedureUseCase.execute({
					franchiseId: franchise.id.toString(),
					name,
					price,
					notes,
				});

				if (isLeft(result)) {
					const error = unwrapEither(result);
					throw new NotFoundException(error.message);
				}

				const { procedure } = unwrapEither(result);
				createdProcedures.push(ProcedurePresenter.toHTTP(procedure));
			}

			return {
				message: `Procedure created for ${createdProcedures.length} franchises`,
				procedures: createdProcedures,
			};
		}

		// Criar para uma franquia específica
		if (!franchiseId) {
			throw new NotFoundException("Franchise ID is required when not creating for all franchises");
		}

		const result = await this.createProcedureUseCase.execute({
			franchiseId,
			name,
			price,
			notes,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case FranchiseNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { procedure } = unwrapEither(result);

		return ProcedurePresenter.toHTTP(procedure);
	}
}

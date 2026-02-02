import { unwrapEither } from "@/shared/either/either";
import { FetchProceduresByFranchiseIdUseCase } from "@/domain/application/use-cases/procedure/fetch-procedures-by-franchise-id";
import {
	Controller,
	Get,
	Param,
} from "@nestjs/common";
import {
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ProcedurePresenter } from "../../presenters/procedure-presenter";

const fetchProceduresByFranchiseIdParamsSchema = z.object({
	franchiseId: z.string(),
});

type FetchProceduresByFranchiseIdParamsSchema = z.infer<typeof fetchProceduresByFranchiseIdParamsSchema>;

const fetchProceduresByFranchiseIdParamsValidationPipe = new ZodValidationPipe(fetchProceduresByFranchiseIdParamsSchema);

@ApiTags("Procedures")
@Controller("/franchises")
export class FetchProceduresByFranchiseIdController {
	constructor(private readonly fetchProceduresByFranchiseIdUseCase: FetchProceduresByFranchiseIdUseCase) {}

	@Get("/:franchiseId/procedures")
	@ApiOperation({
		summary: "Fetch procedures by franchise",
		description: "Retrieves all procedures for a specific franchise.",
	})
	@ApiParam({
		name: "franchiseId",
		type: String,
		description: "Franchise identifier",
	})
	@ApiOkResponse({
		description: "Procedures retrieved successfully",
	})
	async handle(@Param(fetchProceduresByFranchiseIdParamsValidationPipe) params: FetchProceduresByFranchiseIdParamsSchema) {
		const { franchiseId } = params;

		const result = await this.fetchProceduresByFranchiseIdUseCase.execute({ franchiseId });

		const { procedures } = unwrapEither(result);

		return procedures.map(ProcedurePresenter.toHTTP);
	}
}

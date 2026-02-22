import { Inject } from "@nestjs/common";
import { unwrapEither } from "@/shared/either/either";
import { FetchProceduresByClinicIdUseCase } from "@/domain/application/use-cases/procedure/fetch-procedures-by-clinic-id";
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

const fetchProceduresByClinicIdParamsSchema = z.object({
	clinicId: z.string(),
});

type FetchProceduresByClinicIdParamsSchema = z.infer<typeof fetchProceduresByClinicIdParamsSchema>;

const fetchProceduresByClinicIdParamsValidationPipe = new ZodValidationPipe(fetchProceduresByClinicIdParamsSchema);

@ApiTags("Procedures")
@Controller("/clinics")
export class FetchProceduresByClinicIdController {
	constructor(
		@Inject(FetchProceduresByClinicIdUseCase)
		private readonly fetchProceduresByClinicIdUseCase: FetchProceduresByClinicIdUseCase
	) {}

	@Get("/:clinicId/procedures")
	@ApiOperation({
		summary: "Fetch procedures by clinic",
		description: "Retrieves all procedures for a specific clinic.",
	})
	@ApiParam({
		name: "clinicId",
		type: String,
		description: "Clinic identifier",
	})
	@ApiOkResponse({
		description: "Procedures retrieved successfully",
	})
	async handle(@Param(fetchProceduresByClinicIdParamsValidationPipe) params: FetchProceduresByClinicIdParamsSchema) {
		const { clinicId } = params;

		const result = await this.fetchProceduresByClinicIdUseCase.execute({ clinicId });

		const { procedures } = unwrapEither(result);

		return procedures.map(ProcedurePresenter.toHTTP);
	}
}


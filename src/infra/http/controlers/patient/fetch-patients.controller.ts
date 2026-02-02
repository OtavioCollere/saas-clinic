import { unwrapEither } from "@/shared/either/either";
import { FetchPatientsUseCase } from "@/domain/application/use-cases/patient/fetch-patients";
import {
	Controller,
	Get,
	Query,
} from "@nestjs/common";
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { PatientPresenter } from "../../presenters/patient-presenter";

const fetchPatientsQuerySchema = z.object({
	page: z.coerce.number().int().positive(),
	pageSize: z.coerce.number().int().positive().optional(),
	query: z.string().optional(),
});

type FetchPatientsQuerySchema = z.infer<typeof fetchPatientsQuerySchema>;

const fetchPatientsQueryValidationPipe = new ZodValidationPipe(fetchPatientsQuerySchema);

@ApiTags("Patients")
@Controller("/patients")
export class FetchPatientsController {
	constructor(private readonly fetchPatientsUseCase: FetchPatientsUseCase) {}

	@Get()
	@ApiOperation({
		summary: "Fetch patients",
		description: "Retrieves a paginated list of patients with optional search query.",
	})
	@ApiOkResponse({
		description: "Patients retrieved successfully",
	})
	async handle(@Query(fetchPatientsQueryValidationPipe) query: FetchPatientsQuerySchema) {
		const { page, pageSize, query: searchQuery } = query;

		const result = await this.fetchPatientsUseCase.execute({
			page,
			pageSize,
			query: searchQuery,
		});

		const { patients } = unwrapEither(result);

		return patients.map(PatientPresenter.toHTTP);
	}
}

import { unwrapEither } from "@/shared/either/either";
import { FetchPatientsUseCase } from "@/domain/application/use-cases/patient/fetch-patients";
import { Controller, Get, Query, UsePipes } from "@nestjs/common";
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

@Controller("/patients")
export class FetchPatientsController {
	constructor(private readonly fetchPatientsUseCase: FetchPatientsUseCase) {}

	@Get()
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

import { unwrapEither } from "@/shared/either/either";
import { FetchClinicUseCase } from "@/domain/application/use-cases/clinic/fetch-clinic";
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
import { ClinicPresenter } from "../../presenters/clinic-presenter";

const fetchClinicQuerySchema = z.object({
	page: z.coerce.number().int().positive(),
	pageSize: z.coerce.number().int().positive().optional(),
	query: z.string().optional(),
});

type FetchClinicQuerySchema = z.infer<typeof fetchClinicQuerySchema>;

const fetchClinicQueryValidationPipe = new ZodValidationPipe(fetchClinicQuerySchema);

@ApiTags("Clinics")
@Controller("/clinics")
export class FetchClinicController {
	constructor(private readonly fetchClinicUseCase: FetchClinicUseCase) {}

	@Get()
	@ApiOperation({
		summary: "Fetch clinics",
		description: "Retrieves a paginated list of clinics with optional search query.",
	})
	@ApiOkResponse({
		description: "Clinics retrieved successfully",
	})
	async handle(@Query(fetchClinicQueryValidationPipe) query: FetchClinicQuerySchema) {
		const { page, pageSize, query: searchQuery } = query;

		const result = await this.fetchClinicUseCase.execute({
			page,
			pageSize,
			query: searchQuery,
		});

		const { clinics } = unwrapEither(result);

		return clinics.map(ClinicPresenter.toHTTP);
	}
}

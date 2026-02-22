import { isLeft, unwrapEither } from "@/shared/either/either";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { FetchPatientsByClinicIdUseCase } from "@/domain/application/use-cases/patient/fetch-patients-by-clinic-id";
import {
	Controller,
	Get,
	Inject,
	NotFoundException,
	Param,
	Query,
} from "@nestjs/common";
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { PatientPresenter } from "../../presenters/patient-presenter";

const fetchPatientsByClinicIdParamsSchema = z.object({
	clinicId: z.string().uuid(),
});

const fetchPatientsByClinicIdQuerySchema = z.object({
	page: z.coerce.number().int().positive(),
	pageSize: z.coerce.number().int().positive().optional(),
	query: z.string().optional(),
});

type FetchPatientsByClinicIdParamsSchema = z.infer<typeof fetchPatientsByClinicIdParamsSchema>;
type FetchPatientsByClinicIdQuerySchema = z.infer<typeof fetchPatientsByClinicIdQuerySchema>;

const fetchPatientsByClinicIdParamsValidationPipe = new ZodValidationPipe(fetchPatientsByClinicIdParamsSchema);
const fetchPatientsByClinicIdQueryValidationPipe = new ZodValidationPipe(fetchPatientsByClinicIdQuerySchema);

@ApiTags("Patients")
@Controller("/clinics")
export class FetchPatientsByClinicIdController {
	constructor(
		@Inject(FetchPatientsByClinicIdUseCase)
		private readonly fetchPatientsByClinicIdUseCase: FetchPatientsByClinicIdUseCase
	) {}

	@Get("/:clinicId/patients")
	@ApiOperation({
		summary: "Fetch patients by clinic",
		description: "Retrieves a paginated list of patients for a specific clinic with optional search query.",
	})
	@ApiParam({
		name: "clinicId",
		type: String,
		description: "Clinic identifier (UUID)",
	})
	@ApiQuery({
		name: "page",
		type: Number,
		description: "Page number (positive integer)",
		required: true,
	})
	@ApiQuery({
		name: "pageSize",
		type: Number,
		description: "Number of items per page (positive integer, optional, default: 20)",
		required: false,
	})
	@ApiQuery({
		name: "query",
		type: String,
		description: "Search query to filter patients by name (optional)",
		required: false,
	})
	@ApiOkResponse({
		description: "Patients retrieved successfully",
	})
	@ApiNotFoundResponse({
		description: "Clinic not found",
	})
	async handle(
		@Param(fetchPatientsByClinicIdParamsValidationPipe) params: FetchPatientsByClinicIdParamsSchema,
		@Query(fetchPatientsByClinicIdQueryValidationPipe) query: FetchPatientsByClinicIdQuerySchema
	) {
		const { clinicId } = params;
		const { page, pageSize, query: searchQuery } = query;

		const result = await this.fetchPatientsByClinicIdUseCase.execute({
			clinicId,
			page,
			pageSize,
			query: searchQuery,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ClinicNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { patients } = unwrapEither(result);

		return patients.map(PatientPresenter.toHTTPWithUser);
	}
}



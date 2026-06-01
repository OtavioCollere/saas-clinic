import { Inject } from "@nestjs/common";
import { unwrapEither } from "@/shared/either/either";
import { FetchPatientsByClinicIdUseCase } from "@/domain/application/use-cases/patient/fetch-patients-by-clinic-id";
import {
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import {
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
  clinicId: z.string(),
});

const fetchPatientsByClinicIdQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(20),
  query: z.string().optional(),
});

type FetchPatientsByClinicIdParamsSchema = z.infer<typeof fetchPatientsByClinicIdParamsSchema>;
type FetchPatientsByClinicIdQuerySchema = z.infer<typeof fetchPatientsByClinicIdQuerySchema>;

const paramsValidationPipe = new ZodValidationPipe(fetchPatientsByClinicIdParamsSchema);
const queryValidationPipe = new ZodValidationPipe(fetchPatientsByClinicIdQuerySchema);

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
    description: "Retrieves a paginated list of patients for a specific clinic.",
  })
  @ApiParam({ name: "clinicId", type: String, description: "Clinic identifier" })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "pageSize", required: false })
  @ApiQuery({ name: "query", required: false })
  @ApiOkResponse({ description: "Patients retrieved successfully" })
  async handle(
    @Param(paramsValidationPipe) params: FetchPatientsByClinicIdParamsSchema,
    @Query(queryValidationPipe) query: FetchPatientsByClinicIdQuerySchema
  ) {
    const { clinicId } = params;
    const { page, pageSize, query: searchQuery } = query;

    const result = await this.fetchPatientsByClinicIdUseCase.execute({
      clinicId,
      page,
      pageSize,
      query: searchQuery,
    });

    const { patients } = unwrapEither(result);
    return patients.map(PatientPresenter.toHTTP);
  }
}

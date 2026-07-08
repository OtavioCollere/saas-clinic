import { Inject } from "@nestjs/common";
import { unwrapEither } from "@/shared/either/either";
import { FetchPatientsByProfessionalIdUseCase } from "@/domain/application/use-cases/professional/fetch-patients-by-professional-id";
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
import { PatientPresenter } from "../../presenters/patient-presenter";

const fetchPatientsByProfessionalIdParamsSchema = z.object({
  professionalId: z.string(),
});

type FetchPatientsByProfessionalIdParamsSchema = z.infer<typeof fetchPatientsByProfessionalIdParamsSchema>;

const paramsValidationPipe = new ZodValidationPipe(fetchPatientsByProfessionalIdParamsSchema);

@ApiTags("Professionals")
@Controller("/professionals")
export class FetchPatientsByProfessionalIdController {
  constructor(
    @Inject(FetchPatientsByProfessionalIdUseCase)
    private readonly fetchPatientsByProfessionalIdUseCase: FetchPatientsByProfessionalIdUseCase,
  ) {}

  @Get("/:professionalId/patients")
  @ApiOperation({
    summary: "Fetch patients by professional",
    description: "Returns all patients who have had appointments with the given professional.",
  })
  @ApiParam({
    name: "professionalId",
    type: String,
    description: "Professional identifier",
  })
  @ApiOkResponse({ description: "Patients retrieved successfully" })
  async handle(@Param(paramsValidationPipe) params: FetchPatientsByProfessionalIdParamsSchema) {
    const result = await this.fetchPatientsByProfessionalIdUseCase.execute({
      professionalId: params.professionalId,
    });

    const { patients } = unwrapEither(result);

    return patients.map(PatientPresenter.toHTTP);
  }
}

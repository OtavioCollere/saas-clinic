import { Inject } from "@nestjs/common";
import { unwrapEither } from "@/shared/either/either";
import { FetchAppointmentHistoryByClinicIdUseCase } from "@/domain/application/use-cases/appointment/fetch-appointment-history-by-clinic-id";
import { Controller, Get, Param, Query } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { AppointmentPresenter } from "../../presenters/appointment-presenter";

const paramsSchema = z.object({
  clinicId: z.string(),
});

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  perPage: z.coerce.number().int().min(1).max(1000).optional().default(20),
});

type ParamsSchema = z.infer<typeof paramsSchema>;
type QuerySchema = z.infer<typeof querySchema>;

const paramsValidationPipe = new ZodValidationPipe(paramsSchema);
const queryValidationPipe = new ZodValidationPipe(querySchema);

@ApiTags("Appointments")
@Controller("/clinics")
export class FetchAppointmentHistoryByClinicIdController {
  constructor(
    @Inject(FetchAppointmentHistoryByClinicIdUseCase)
    private readonly fetchAppointmentHistoryByClinicIdUseCase: FetchAppointmentHistoryByClinicIdUseCase,
  ) {}

  @Get("/:clinicId/appointments/history")
  @ApiOperation({
    summary: "Fetch appointment history by clinic ID (paginated)",
    description:
      "Retrieves past appointments (endAt < now), most recent first. Use for histórico de consultas.",
  })
  @ApiParam({ name: "clinicId", type: String })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number (default 1)" })
  @ApiQuery({ name: "perPage", required: false, type: Number, description: "Items per page (default 20, max 100)" })
  @ApiOkResponse({ description: "Paginated appointment history" })
  async handle(
    @Param(paramsValidationPipe) params: ParamsSchema,
    @Query(queryValidationPipe) query: QuerySchema,
  ) {
    const { clinicId } = params;
    const { page, perPage } = query;

    const result = await this.fetchAppointmentHistoryByClinicIdUseCase.execute({
      clinicId,
      page,
      perPage,
    });

    const { appointments, total, patients, professionals, users } = unwrapEither(result);

    const items = appointments.map((appointment) => {
      const patient = patients.get(appointment.patientId.toString());
      const professional = professionals.get(appointment.professionalId.toString());
      const user = professional ? users.get(professional.userId.toString()) : null;
      return AppointmentPresenter.toHTTP(appointment, patient ?? undefined, user ?? undefined);
    });

    return {
      items,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }
}

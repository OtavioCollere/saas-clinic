import { Inject } from "@nestjs/common";
import { unwrapEither } from "@/shared/either/either";
import { FetchServiceOrdersByPatientIdUseCase } from "@/domain/application/use-cases/service-order/fetch-service-orders-by-patient-id";
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
import { ServiceOrderPresenter } from "../../presenters/service-order-presenter";

const fetchServiceOrdersByPatientIdParamsSchema = z.object({
  patientId: z.string(),
});

type FetchServiceOrdersByPatientIdParamsSchema = z.infer<typeof fetchServiceOrdersByPatientIdParamsSchema>;

const paramsValidationPipe = new ZodValidationPipe(fetchServiceOrdersByPatientIdParamsSchema);

@ApiTags("Service Orders")
@Controller("/patients")
export class FetchServiceOrdersByPatientIdController {
  constructor(
    @Inject(FetchServiceOrdersByPatientIdUseCase)
    private readonly fetchServiceOrdersByPatientIdUseCase: FetchServiceOrdersByPatientIdUseCase,
  ) {}

  @Get("/:patientId/service-orders")
  @ApiOperation({
    summary: "Fetch service orders by patient",
    description: "Retrieves all service orders (comandas) for a specific patient.",
  })
  @ApiParam({
    name: "patientId",
    type: String,
    description: "Patient identifier",
  })
  @ApiOkResponse({ description: "Service orders retrieved successfully" })
  async handle(@Param(paramsValidationPipe) params: FetchServiceOrdersByPatientIdParamsSchema) {
    const result = await this.fetchServiceOrdersByPatientIdUseCase.execute({
      patientId: params.patientId,
    });

    const { serviceOrders } = unwrapEither(result);

    return serviceOrders.map(ServiceOrderPresenter.toHTTP);
  }
}

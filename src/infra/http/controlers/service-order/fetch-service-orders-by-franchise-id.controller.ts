import { Inject } from "@nestjs/common";
import { unwrapEither } from "@/shared/either/either";
import { FetchServiceOrdersByFranchiseIdUseCase } from "@/domain/application/use-cases/service-order/fetch-service-orders-by-franchise-id";
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
import { ServiceOrderPresenter } from "../../presenters/service-order-presenter";

const fetchServiceOrdersByFranchiseIdParamsSchema = z.object({
  franchiseId: z.string(),
});

const fetchServiceOrdersByFranchiseIdQuerySchema = z.object({
  status: z.string().optional(),
});

type FetchServiceOrdersByFranchiseIdParamsSchema = z.infer<typeof fetchServiceOrdersByFranchiseIdParamsSchema>;
type FetchServiceOrdersByFranchiseIdQuerySchema = z.infer<typeof fetchServiceOrdersByFranchiseIdQuerySchema>;

const paramsValidationPipe = new ZodValidationPipe(fetchServiceOrdersByFranchiseIdParamsSchema);
const queryValidationPipe = new ZodValidationPipe(fetchServiceOrdersByFranchiseIdQuerySchema);

@ApiTags("Service Orders")
@Controller("/franchises")
export class FetchServiceOrdersByFranchiseIdController {
  constructor(
    @Inject(FetchServiceOrdersByFranchiseIdUseCase)
    private readonly fetchServiceOrdersByFranchiseIdUseCase: FetchServiceOrdersByFranchiseIdUseCase,
  ) {}

  @Get("/:franchiseId/service-orders")
  @ApiOperation({
    summary: "Fetch service orders by franchise",
    description: "Retrieves all service orders (comandas) for a specific franchise.",
  })
  @ApiParam({
    name: "franchiseId",
    type: String,
    description: "Franchise identifier",
  })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter by status: PENDING, WAITING_PAYMENT, PAID, CANCELED, FAILED",
  })
  @ApiOkResponse({ description: "Service orders retrieved successfully" })
  async handle(
    @Param(paramsValidationPipe) params: FetchServiceOrdersByFranchiseIdParamsSchema,
    @Query(queryValidationPipe) query: FetchServiceOrdersByFranchiseIdQuerySchema,
  ) {
    const result = await this.fetchServiceOrdersByFranchiseIdUseCase.execute({
      franchiseId: params.franchiseId,
      status: query.status,
    });

    const { serviceOrders } = unwrapEither(result);

    return serviceOrders.map(ServiceOrderPresenter.toHTTP);
  }
}

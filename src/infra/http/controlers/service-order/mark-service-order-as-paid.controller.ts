import { Inject } from "@nestjs/common";
import { isLeft, unwrapEither } from "@/shared/either/either";
import { MarkServiceOrderAsPaidUseCase } from "@/domain/application/use-cases/service-order/mark-service-order-as-paid";
import { ServiceOrderNotFoundError } from "@/shared/errors/service-order-not-found-error";
import { ServiceOrderAlreadyPaidError } from "@/shared/errors/service-order-already-paid-error";
import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const markServiceOrderAsPaidParamsSchema = z.object({
  serviceOrderId: z.string(),
});

type MarkServiceOrderAsPaidParamsSchema = z.infer<typeof markServiceOrderAsPaidParamsSchema>;

const paramsValidationPipe = new ZodValidationPipe(markServiceOrderAsPaidParamsSchema);

@ApiTags("Service Orders")
@Controller("/service-orders")
export class MarkServiceOrderAsPaidController {
  constructor(
    @Inject(MarkServiceOrderAsPaidUseCase)
    private readonly markServiceOrderAsPaidUseCase: MarkServiceOrderAsPaidUseCase,
  ) {}

  @Patch("/:serviceOrderId/pay")
  @HttpCode(204)
  @ApiOperation({
    summary: "Mark service order as paid",
    description: "Marks a service order (comanda) as paid.",
  })
  @ApiParam({
    name: "serviceOrderId",
    type: String,
    description: "Service order identifier",
  })
  @ApiNoContentResponse({ description: "Service order marked as paid" })
  @ApiNotFoundResponse({ description: "Service order not found" })
  @ApiBadRequestResponse({ description: "Service order is already paid" })
  async handle(@Param(paramsValidationPipe) params: MarkServiceOrderAsPaidParamsSchema) {
    const result = await this.markServiceOrderAsPaidUseCase.execute({
      serviceOrderId: params.serviceOrderId,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case ServiceOrderNotFoundError:
          throw new NotFoundException(error.message);
        case ServiceOrderAlreadyPaidError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}

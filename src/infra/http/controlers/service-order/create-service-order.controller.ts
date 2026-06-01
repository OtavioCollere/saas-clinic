import { Inject } from "@nestjs/common";
import { isLeft, unwrapEither } from "@/shared/either/either";
import { ConfirmAppointmentUseCase } from "@/domain/application/use-cases/appointment/confirm-appointment";
import { AppointmentConfirmedEvent } from "@/domain/enterprise/events/appointment-confirmed.event";
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ServiceOrderPresenter } from "../../presenters/service-order-presenter";
import { AppointmentNotFoundError } from "@/shared/errors/appointment-not-found-error";
import { PatientNotFoundError } from "@/shared/errors/patient-not-found-error";
import { AppointmentNotWaitingError } from "@/shared/errors/appointment-not-waiting-error";
import { PaymentMethod } from "@/domain/enterprise/value-objects/payment-method";

const createServiceOrderBodySchema = z.object({
  appointmentId: z.string().min(1, "appointmentId é obrigatório"),
  patientId: z.string().min(1, "patientId é obrigatório"),
  items: z.array(
    z.object({
      appointmentItemId: z.string().optional(),
      procedureId: z.string().optional(),
      productId: z.string().optional(),
      price: z.number().min(0),
      notes: z.string().optional(),
    }).refine(
      (item) => !!item.procedureId || !!item.productId,
      { message: 'Each item must have either procedureId or productId' }
    )
  ).min(1, "Pelo menos um item é obrigatório"),
  status: z.enum(["PENDING", "WAITING_PAYMENT", "PAID", "CANCELED", "FAILED"]).optional(),
  paymentMethod: z.enum(["credit_card", "debit_card", "pix", "bank_transfer", "cash", "other"]).optional(),
});

type CreateServiceOrderBodySchema = z.infer<typeof createServiceOrderBodySchema>;

const createServiceOrderBodyValidationPipe = new ZodValidationPipe(createServiceOrderBodySchema);

@ApiTags("Service Orders")
@Controller("/service-orders")
export class CreateServiceOrderController {
  constructor(
    @Inject(ConfirmAppointmentUseCase)
    private readonly confirmAppointmentUseCase: ConfirmAppointmentUseCase,
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Create service order",
    description: "Creates a new service order from appointment items.",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        appointmentId: {
          type: "string",
          description: "ID do agendamento a ser confirmado",
        },
        patientId: {
          type: "string",
          description: "ID do paciente do agendamento",
        },
        appointmentItemIds: {
          type: "array",
          items: { type: "string" },
          description: "IDs dos itens do agendamento (appointment_item.id)",
          example: ["uuid-do-appointment-item-1", "uuid-do-appointment-item-2"],
        },
        status: {
          type: "string",
          enum: ["PENDING", "WAITING_PAYMENT", "PAID", "CANCELED", "FAILED"],
          nullable: true,
        },
        paymentMethod: {
          type: "string",
          enum: ["credit_card", "debit_card", "pix", "bank_transfer", "cash", "other"],
          nullable: true,
        },
      },
      required: ["appointmentId", "patientId", "appointmentItemIds"],
    },
  })
  @ApiOkResponse({
    description: "Service order created successfully",
  })
  @ApiNotFoundResponse({
    description: "One or more appointment items not found",
  })
  @ApiBadRequestResponse({
    description: "Invalid request data",
  })
  async handle(@Body(createServiceOrderBodyValidationPipe) body: CreateServiceOrderBodySchema) {
    const { appointmentId, patientId, items, status, paymentMethod } = body;

    const confirmResult = await this.confirmAppointmentUseCase.execute({ appointmentId, patientId });

    if (isLeft(confirmResult)) {
      const err = unwrapEither(confirmResult) as AppointmentNotFoundError | PatientNotFoundError | AppointmentNotWaitingError;
      switch (err.constructor) {
        case AppointmentNotFoundError:
        case PatientNotFoundError:
          throw new NotFoundException(err.message);
        case AppointmentNotWaitingError:
          throw new BadRequestException(err.message);
        default:
          throw new BadRequestException(err.message);
      }
    }

    const event = new AppointmentConfirmedEvent(
      appointmentId,
      items,
      status,
      paymentMethod as PaymentMethod | undefined,
    );

    const results = await this.eventEmitter.emitAsync("appointment.confirmed", event);
    const serviceOrder = results?.[0];

    if (!serviceOrder) {
      throw new BadRequestException("Falha ao criar comanda após confirmação do agendamento.");
    }

    return ServiceOrderPresenter.toHTTP(serviceOrder);
  }
}

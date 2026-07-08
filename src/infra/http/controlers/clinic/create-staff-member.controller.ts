import { isLeft, unwrapEither } from "@/shared/either/either";
import { UserIsNotOwnerError } from "@/shared/errors/user-is-not-owner-error";
import { EmailAlreadyExistsError } from "@/shared/errors/email-already-exists-error";
import { CpfAlreadyExistsError } from "@/shared/errors/cpf-already-exists-error";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { CreateStaffMemberUseCase } from "@/domain/application/use-cases/clinic/create-staff-member";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import type { FastifyRequest } from "fastify";
import type { UserPayload } from "@/infra/auth/jwt-strategy";

const bodySchema = z.object({
  name: z.string().min(2),
  cpf: z.string(),
  email: z.string().email(),
});

type BodySchema = z.infer<typeof bodySchema>;

@ApiTags("Clinic")
@Controller("/clinics/:clinicId/staff")
export class CreateStaffMemberController {
  constructor(
    @Inject(CreateStaffMemberUseCase)
    private useCase: CreateStaffMemberUseCase,
  ) {}

  @Post()
  async handle(
    @Param("clinicId") clinicId: string,
    @Body(new ZodValidationPipe(bodySchema)) body: BodySchema,
    @Req() request: FastifyRequest & { user?: UserPayload },
  ) {
    const ownerId = request.user?.sub;
    if (!ownerId) throw new ForbiddenException("Não autenticado");

    const result = await this.useCase.execute({
      clinicId,
      ownerId,
      name: body.name,
      cpf: body.cpf,
      email: body.email,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case ClinicNotFoundError:
          throw new NotFoundException(error.message);
        case UserIsNotOwnerError:
          throw new ForbiddenException(error.message);
        case EmailAlreadyExistsError:
        case CpfAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return unwrapEither(result);
  }
}

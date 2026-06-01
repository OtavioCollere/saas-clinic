import { isLeft, unwrapEither } from "@/shared/either/either";
import { PatientNotFoundError } from "@/shared/errors/patient-not-found-error";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { GetPatientByUserIdUseCase } from "@/domain/application/use-cases/patient/get-patient-by-user-id";
import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Req,
} from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import type { FastifyRequest } from "fastify";
import { PatientPresenter } from "../../presenters/patient-presenter";
import type { UserPayload } from "@/infra/auth/jwt-strategy";
import { Tenant } from "../../decorators/tenant.decorator";

interface AuthenticatedRequest extends FastifyRequest {
  user?: UserPayload;
}

@ApiTags("Users")
@Controller("/users")
export class GetPatientByUserIdController {
  constructor(
    @Inject(GetPatientByUserIdUseCase)
    private readonly getPatientByUserIdUseCase: GetPatientByUserIdUseCase,
  ) {}

  @Get("/me/patient")
  @ApiOperation({
    summary: "Get patient by current user",
    description: "Retrieves patient information for the authenticated user (by userId).",
  })
  @ApiOkResponse({
    description: "Patient retrieved successfully",
  })
  @ApiNotFoundResponse({
    description: "Patient not found for this user",
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
  })
  async handle(
    @Req() request: AuthenticatedRequest,
    @Tenant() clinicSlug: string,
  ) {
    const payload = request.user;

    if (!payload?.sub) {
      throw new NotFoundException("User not found");
    }

    if (!clinicSlug) {
      throw new BadRequestException(
        "Tenant (clinic slug) is required. Provide it via X-Tenant-ID header.",
      );
    }

    const result = await this.getPatientByUserIdUseCase.execute({
      userId: payload.sub,
      clinicSlug,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case PatientNotFoundError:
        case ClinicNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new NotFoundException(error.message);
      }
    }

    const { patient } = unwrapEither(result);

    return PatientPresenter.toHTTP(patient);
  }
}

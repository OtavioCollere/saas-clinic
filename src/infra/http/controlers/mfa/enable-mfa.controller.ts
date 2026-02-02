import { isLeft, unwrapEither } from "@/shared/either/either";
import { InvalidTotpCodeError } from "@/shared/errors/invalid-totp-code-error";
import { MfaAlreadyEnabledError } from "@/shared/errors/mfa-already-enabled-error";
import { MfaSettingsNotFoundError } from "@/shared/errors/mfa-settings-not-found-error";
import { EnableMfaUseCase } from "@/domain/application/use-cases/mfa/enable-mfa";
import { User } from "@/domain/enterprise/entities/user";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import {
	BadRequestException,
	Body,
	Controller,
	Post,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const enableMfaBodySchema = z.object({
  totpCode: z.string(),
});

type EnableMfaBodySchema = z.infer<typeof enableMfaBodySchema>;

const enableMfaBodyValidationPipe = new ZodValidationPipe(enableMfaBodySchema);

@ApiTags("MFA")
@Controller("/mfa")
export class EnableMfaController {
  constructor(private enableMfaUseCase: EnableMfaUseCase) {}

  @Post("/enable")
  @ApiOperation({
    summary: "Enable MFA",
    description: "Enables multi-factor authentication for the authenticated user.",
  })
  @ApiOkResponse({
    description: "MFA enabled successfully",
  })
  @ApiBadRequestResponse({
    description: "Invalid TOTP code or MFA already enabled",
  })
  async handle(
    @CurrentUser() user: User,
    @Body(enableMfaBodyValidationPipe) body: EnableMfaBodySchema
  ) {
    const result = await this.enableMfaUseCase.execute({
      userId: user.id.toString(),
      totpCode: body.totpCode,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case MfaSettingsNotFoundError:
          throw new BadRequestException(error.message);
        case MfaAlreadyEnabledError:
          throw new BadRequestException(error.message);
        case InvalidTotpCodeError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { mfa_status } = unwrapEither(result);

    return {
      mfa_status,
    };
  }
}


import { isLeft, unwrapEither } from "@/shared/either/either";
import { InvalidTotpCodeError } from "@/shared/errors/invalid-totp-code-error";
import { MfaSettingsNotFoundError } from "@/shared/errors/mfa-settings-not-found-error";
import { MfaVerifyLoginUseCase } from "@/domain/application/use-cases/mfa/mfa-verify-login";
import { User } from "@/domain/enterprise/entities/user";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { Fingerprint } from "@/infra/http/decorators/fingerprint.decorator";
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

const mfaVerifyLoginBodySchema = z.object({
  sessionId: z.string().uuid(),
  totpCode: z.string(),
});

type MfaVerifyLoginBodySchema = z.infer<typeof mfaVerifyLoginBodySchema>;

const mfaVerifyLoginBodyValidationPipe = new ZodValidationPipe(mfaVerifyLoginBodySchema);

@ApiTags("MFA")
@Controller("/mfa")
export class MfaVerifyLoginController {
  constructor(private mfaVerifyLoginUseCase: MfaVerifyLoginUseCase) {}

  @Post("/verify-login")
  @ApiOperation({
    summary: "Verify MFA login",
    description: "Verifies TOTP code and completes MFA authentication.",
  })
  @ApiOkResponse({
    description: "MFA verified successfully",
  })
  @ApiBadRequestResponse({
    description: "Invalid TOTP code",
  })
  async handle(
    @CurrentUser() user: User,
    @Fingerprint() fingerprint: Fingerprint,
    @Body(mfaVerifyLoginBodyValidationPipe) body: MfaVerifyLoginBodySchema
  ) {
    const result = await this.mfaVerifyLoginUseCase.execute({
      userId: user.id.toString(),
      sessionId: body.sessionId,
      totpCode: body.totpCode,
      fingerprint,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case MfaSettingsNotFoundError:
          throw new BadRequestException(error.message);
        case InvalidTotpCodeError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { access_token, refresh_token } = unwrapEither(result);

    return {
      access_token,
      refresh_token,
    };
  }
}


import { isLeft, unwrapEither } from "@/shared/either/either";
import { WrongCredentialsError } from "@/shared/errors/wrong-credentials-error";
import { AuthenticateUserUseCase } from "@/domain/application/use-cases/users/authenticate-user";
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { Fingerprint } from "../../decorators/fingerprint.decorator";
import { Public } from "@/infra/auth/public";
import { RateLimit } from "@/shared/decorators/rate-limit.decorator";

const authenticateUserBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>;

@Public()
@RateLimit({capacity : 5, refillRate : 1})
@Controller("/users")
export class AuthenticateUserController {
  constructor(
    @Inject(AuthenticateUserUseCase)
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @Post("/authenticate")
  async handle(
    @Body(new ZodValidationPipe(authenticateUserBodySchema))
    body: AuthenticateUserBodySchema,
    @Fingerprint() fingerprint: Fingerprint,
  ) {
    const { email, password } = body;

    const result = await this.authenticateUserUseCase.execute({
      email,
      password,
      fingerprint,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const success = unwrapEither(result);

    switch (success.type) {
      case "authenticated":
        return {
          access_token: success.access_token,
          refresh_token: success.refresh_token,
        };

      case "mfa_required":
        return {
          session_id: success.session_id,
          mfa_required: true,
        };
    }
  }
}

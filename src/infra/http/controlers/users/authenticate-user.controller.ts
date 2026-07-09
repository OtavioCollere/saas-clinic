import { isLeft, unwrapEither } from "@/shared/either/either";
import { WrongCredentialsError } from "@/shared/errors/wrong-credentials-error";
import { AuthenticateUserUseCase } from "@/domain/application/use-cases/users/authenticate-user";
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Inject,
	Post,
  Res,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { Fingerprint } from "../../decorators/fingerprint.decorator";
import { Tenant } from "../../decorators/tenant.decorator";
import { Public } from "@/infra/auth/public";
import { RateLimit } from "@/shared/decorators/rate-limit.decorator";

const authenticateUserBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>;

const authenticateUserBodyValidationPipe = new ZodValidationPipe(authenticateUserBodySchema);

@Public()
@RateLimit({capacity : 5, refillRate : 1})
@ApiTags("Users")
@Controller("/users")
export class AuthenticateUserController {
  constructor(
    @Inject(AuthenticateUserUseCase)
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @Post("/authenticate")
  @ApiOperation({
    summary: "Authenticate user",
    description: "Authenticates a user and returns access tokens or MFA challenge.",
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'joao@example.com' },
        password: { type: 'string', format: 'password', example: 'senha123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiOkResponse({
    description: "User authenticated successfully",
  })
  @ApiBadRequestResponse({
    description: "Invalid credentials",
  })
  @HttpCode(200)
  async handle(
    @Body(authenticateUserBodyValidationPipe)
    body: AuthenticateUserBodySchema,
    @Fingerprint() fingerprint: Fingerprint,
    @Tenant() clinicSlug: string,
    @Res({passthrough: true}) reply,
  ) {
    const { email, password } = body;

    const result = await this.authenticateUserUseCase.execute({
      email,
      password,
      fingerprint,
      clinicSlug,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case WrongCredentialsError:
        default:
          throw new BadRequestException(error.message);
      }
    }

    const response = unwrapEither(result);

    switch (response.type) {
      case "authenticated": {
        const isProduction = process.env.NODE_ENV === "production";
        
        reply.setCookie("access_token", response.access_token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          path: "/",
          maxAge: 60 * 15,
        })

        reply.setCookie("refresh_token", response.refresh_token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        })

        return {
          message: "User authenticated successfully",
        };
      }
      case "mfa_required": {
        return {
          session_id: response.session_id,
          mfa_required: true,
        };
      }
    }
  }
}

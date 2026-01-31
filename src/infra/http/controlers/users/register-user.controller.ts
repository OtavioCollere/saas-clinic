import { isLeft, unwrapEither } from "@/shared/either/either";
import { EmailAlreadyExistsError } from "@/shared/errors/email-already-exists-error";
import { InvalidCpfError } from "@/shared/errors/invalid-cpf-error";
import { InvalidEmailError } from "@/shared/errors/invalid-email-error";
import { CpfAlreadyExistsError } from "@/shared/errors/cpf-already-exists-error";
import { RegisterUserUseCase } from "@/domain/application/use-cases/users/register-user";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Inject,
  Post,
  UsePipes,
} from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { UserPresenter } from "../../presenters/user-presenter";
import { Public } from "@/infra/auth/public";
import { RateLimit } from "@/shared/decorators/rate-limit.decorator";

const registerUserBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>;

@Public()
@RateLimit({capacity : 5, refillRate : 1})
@Controller("/users")
export class RegisterUserController {
  constructor(
    @Inject(RegisterUserUseCase)
    private readonly registerUser: RegisterUserUseCase,
  ) {}

  @Post("/register-user")
  @UsePipes(new ZodValidationPipe(registerUserBodySchema))
  async handle(@Body() body: RegisterUserBodySchema) {
    const { name, cpf, email, password } = body;

    const result = await this.registerUser.execute({
      name,
      cpf,
      email,
      password,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case EmailAlreadyExistsError:
        case CpfAlreadyExistsError:
          throw new ConflictException(error.message);

        case InvalidCpfError:
        case InvalidEmailError:
          throw new BadRequestException(error.message);

        default:
          throw new BadRequestException(error.message);
      }
    }

    const { user } = unwrapEither(result);

    return UserPresenter.toHTTP(user);
  }
}

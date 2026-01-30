import { isLeft, unwrapEither } from "@/core/either/either";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists-error";
import { InvalidCpfError } from "@/core/errors/invalid-cpf-error";
import { InvalidEmailError } from "@/core/errors/invalid-email-error";
import { CpfAlreadyExistsError } from "@/core/errors/cpf-already-exists-error";
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

const registerUserBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>;

@Public()
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

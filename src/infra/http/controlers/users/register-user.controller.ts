import { isLeft, unwrapEither } from "@/core/either/either";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists-error";
import type { RegisterUserUseCase } from "@/domain/application/use-cases/users/register-user";
import { BadRequestException, Body, Controller, Post, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { UserPresenter } from "../../presenters/user-presenter";

const registerUserBodySchema = z.object({
	name: z.string(),
	cpf: z.string(),
	email: z.string().email(),
	password: z.string(),
});

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>;

const registerUserValidationPipe = new ZodValidationPipe(registerUserBodySchema);

@Controller("/users")
export class RegisterUserController {
	constructor(private registerUser: RegisterUserUseCase) {}

	@Post("/register-user")
	@UsePipes(registerUserValidationPipe)
	async handle(@Body() body: RegisterUserBodySchema) {
    const { name, cpf, email, password } = body;

    const result = await this.registerUser.execute({ name, cpf, email, password });

    if (isLeft(result)) {
    
      const error = unwrapEither(result)

      switch (error.constructor) {
        case EmailAlreadyExistsError:
          return new BadRequestException(error.message);
        default:
          return new BadRequestException(error.message);
      }
    }

    const { user } = unwrapEither(result);

    return UserPresenter.toHTTP(user);
  }
}

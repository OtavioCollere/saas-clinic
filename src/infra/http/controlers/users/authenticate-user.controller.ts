import { isLeft, unwrapEither } from "@/core/either/either";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import type { AuthenticateUserUseCase } from "@/domain/application/use-cases/users/authenticate-user";
import { BadRequestException, Body, Controller, Post, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const authenticateUserBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>;

const authenticateUserBodyValidationPipe = new ZodValidationPipe(authenticateUserBodySchema);

@Controller("/users")
export class AuthenticateUserController {
	constructor(private readonly authenticateUserUseCase: AuthenticateUserUseCase) {}

	@Post("/authenticate")
	@UsePipes(authenticateUserBodyValidationPipe)
	async handle(@Body() body: AuthenticateUserBodySchema) {
		const { email, password } = body;

		const result = await this.authenticateUserUseCase.execute({
			email,
			password,
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

		const { access_token, refresh_token } = unwrapEither(result);

		return {
			access_token,
			refresh_token,
		};
	}
}

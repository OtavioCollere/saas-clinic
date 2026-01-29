import { isLeft, unwrapEither } from "@/core/either/either";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { AuthenticateUserUseCase } from "@/domain/application/use-cases/users/authenticate-user";
import { BadRequestException, Body, Controller, Inject, Post, UsePipes } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { Fingerprint } from "../../decorators/fingerprint.decorator";
import { AuthenticateUserDto } from "./dtos/authenticate-user.dto";
import { Public } from "@/infra/auth/public";

const authenticateUserBodySchema = z.object({
	email: z.string(),
	password: z.string(),
});

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>;

@Public()
@Controller("/users")
export class AuthenticateUserController {
	constructor(
		@Inject(AuthenticateUserUseCase)
		private readonly authenticateUserUseCase: AuthenticateUserUseCase
	) {}

	@Post("/authenticate")
	@ApiBody({ type: AuthenticateUserDto })
	async handle(
		@Body() body: AuthenticateUserBodySchema,
		@Fingerprint() fingerprint: Fingerprint
	) {
		const { email, password } = body;

		const result = await this.authenticateUserUseCase.execute({
			email,
			fingerprint,
			password
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

		const success = unwrapEither(result)

		switch (success.type) {
			case 'authenticated':
				return {
					access_token: success.access_token,
					refresh_token: success.refresh_token,
				}
	
			case 'mfa_required':
				return {
					session_id: success.session_id,
					mfa_required: true,
				}
		}
	}
}

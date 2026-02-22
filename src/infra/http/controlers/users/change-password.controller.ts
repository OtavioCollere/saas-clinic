import { HttpCode, HttpStatus, Inject } from "@nestjs/common";
import { isLeft, unwrapEither } from "@/shared/either/either";
import { ChangePasswordUseCase } from "@/domain/application/use-cases/users/change-password";
import {
	BadRequestException,
	Body,
	Controller,
	Post,
	NotFoundException,
	Query,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { PasswordVerificationNotFoundError } from "@/shared/errors/password-verification-not-found-error";
import { PasswordTokenExpiredError } from "@/shared/errors/password-token-expired-error";
import { UserNotFoundError } from "@/shared/errors/user-not-found-error";

const changePasswordQuerySchema = z.object({
	token: z.string(),
});

type ChangePasswordQuerySchema = z.infer<typeof changePasswordQuerySchema>;

const changePasswordQueryValidationPipe = new ZodValidationPipe(changePasswordQuerySchema);

const changePasswordBodySchema = z.object({
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>;

const changePasswordBodyValidationPipe = new ZodValidationPipe(changePasswordBodySchema);

@ApiTags("Users")
@Controller("/users")
export class ChangePasswordController {
	constructor(
		@Inject(ChangePasswordUseCase)
		private readonly changePasswordUseCase: ChangePasswordUseCase
	) {}

	@Post("/change-password")
  @HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: "Change password",
		description: "Changes user password using a verification token from email.",
	})
	@ApiQuery({
		name: "token",
		type: String,
		description: "Password verification token from email",
		required: true,
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				password: { type: 'string', example: 'newSecurePassword123', minLength: 6 },
			},
			required: ['password'],
		},
	})
	@ApiOkResponse({
		description: "Password changed successfully",
	})
	@ApiBadRequestResponse({
		description: "Invalid token, expired token, or invalid password",
	})
	@ApiBadRequestResponse({
		description: "User not found",
	})
	async handle(
		@Query(changePasswordQueryValidationPipe) query: ChangePasswordQuerySchema,
		@Body(changePasswordBodyValidationPipe) body: ChangePasswordBodySchema
	) {
		const { token } = query;
		const { password } = body;

		const result = await this.changePasswordUseCase.execute({ password, token });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case PasswordVerificationNotFoundError:
				case PasswordTokenExpiredError:
					throw new BadRequestException(error.message);
				case UserNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { user } = unwrapEither(result);

		return {
			message: "Password changed successfully",
			userId: user.id.toString(),
		};
	}
}


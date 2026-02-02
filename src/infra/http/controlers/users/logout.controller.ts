import { isLeft, unwrapEither } from "@/shared/either/either";
import { UserNotFoundError } from "@/shared/errors/user-not-found-error";
import { LogoutUseCase } from "@/domain/application/use-cases/users/logout";
import {
	BadRequestException,
	Controller,
	NotFoundException,
	Post,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { User } from "@/domain/enterprise/entities/user";

@ApiTags("Users")
@Controller("/users")
export class LogoutController {
	constructor(private readonly logoutUseCase: LogoutUseCase) {}

	@Post("/logout")
	@ApiOperation({
		summary: "Logout user",
		description: "Logs out the authenticated user and revokes all active sessions.",
	})
	@ApiOkResponse({
		description: "User logged out successfully",
	})
	@ApiNotFoundResponse({
		description: "User not found",
	})
	@ApiBadRequestResponse({
		description: "Invalid request",
	})
	async handle(@CurrentUser() user: User) {
		const result = await this.logoutUseCase.execute({
			userId: user.id.toString(),
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case UserNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return {
			message: 'Logout successful',
		};
	}
}

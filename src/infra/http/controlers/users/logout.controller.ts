import { isLeft, unwrapEither } from "@/core/either/either";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { LogoutUseCase } from "@/domain/application/use-cases/users/logout";
import { BadRequestException, Controller, NotFoundException, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { User } from "@/domain/enterprise/entities/user";

@Controller("/users")
export class LogoutController {
	constructor(private readonly logoutUseCase: LogoutUseCase) {}

	@Post("/logout")
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

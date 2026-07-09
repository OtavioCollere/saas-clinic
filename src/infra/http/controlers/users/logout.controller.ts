import { isLeft, unwrapEither } from "@/shared/either/either";
import { UserNotFoundError } from "@/shared/errors/user-not-found-error";
import { LogoutUseCase } from "@/domain/application/use-cases/users/logout";
import {
	BadRequestException,
	Controller,
	Inject,
	NotFoundException,
	Post,
	Res,
	Req,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import type { FastifyRequest } from 'fastify';
import type { UserPayload } from "@/infra/auth/jwt-strategy";

@ApiTags("Users")
@Controller("/users")
export class LogoutController {
	constructor(
		@Inject(LogoutUseCase)
		private readonly logoutUseCase: LogoutUseCase,
	) {}

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
	async handle(@Req() request: FastifyRequest & { user?: UserPayload }, @Res({ passthrough: true }) reply) {
		const user = request.user;
		
		if (!user || !user.sub) {
			throw new NotFoundException('User not found');
		}

		const result = await this.logoutUseCase.execute({
			userId: user.sub,
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

		// Limpa os cookies de autenticação
		// As opções devem corresponder às usadas ao criar os cookies
		const isProduction = process.env.NODE_ENV === "production";
		
		(reply as any).clearCookie('access_token', {
			path: '/',
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? "none" : "lax",
		});

		(reply as any).clearCookie('refresh_token', {
			path: '/',
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? "none" : "lax",
		});

		return {
			message: 'Logout successful',
		};
	}
}

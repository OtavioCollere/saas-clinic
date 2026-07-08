import { isLeft, unwrapEither } from "@/shared/either/either";
import { UserNotFoundError } from "@/shared/errors/user-not-found-error";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { ClinicMembershipNotFoundError } from "@/shared/errors/clinic-membership-not-found-error";
import { GetCurrentUserUseCase } from "@/domain/application/use-cases/users/get-current-user";
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Inject,
	NotFoundException,
	Req,
} from "@nestjs/common";
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import type { FastifyRequest } from 'fastify';
import { UserPresenter } from "../../presenters/user-presenter";
import type { UserPayload } from "@/infra/auth/jwt-strategy";
import { Tenant } from "../../decorators/tenant.decorator";

interface AuthenticatedRequest extends FastifyRequest {
	user?: UserPayload;
}

@ApiTags("Users")
@Controller("/users")
export class MeController {
	constructor(
		@Inject(GetCurrentUserUseCase)
		private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
	) {}

	@Get("/me")
	@HttpCode(200)
	@ApiOperation({
		summary: "Get current user",
		description: "Returns the authenticated user's information based on the JWT token.",
	})
	@ApiOkResponse({
		description: "User information retrieved successfully",
	})
	@ApiUnauthorizedResponse({
		description: "Invalid or missing token",
	})
	async handle(
		@Req() request: AuthenticatedRequest,
		@Tenant() clinicSlug: string,
) {
		// O JWT guard já validou o token e populou request.user com o payload
		const payload = request.user;
		
		if (!payload || !payload.sub) {
			throw new NotFoundException('User not found');
		}

		if (!clinicSlug) {
			throw new BadRequestException('Tenant (clinic slug) is required. Provide it via X-Tenant-ID header or ?tenant= query parameter.');
		}

		const result = await this.getCurrentUserUseCase.execute({
			userId: payload.sub,
			clinicSlug,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case UserNotFoundError:
					throw new NotFoundException(error.message);
				case ClinicNotFoundError:
					throw new NotFoundException(error.message);
				case ClinicMembershipNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { user: currentUser, clinicMembershipId, clinicId, clinicRole, permissions, hasFranchise, patientId, professionalId, isAnamneseDone } = unwrapEither(result);

		return {
			user: UserPresenter.toHTTP(currentUser),
			clinicMembershipId,
			clinicId,
			clinicRole: clinicRole.getValue(),
			permissions,
			hasFranchise,
			...(patientId !== undefined && { patientId }),
			...(professionalId !== undefined && { professionalId }),
			...(isAnamneseDone !== undefined && { isAnamneseDone }),
		};
	}
}


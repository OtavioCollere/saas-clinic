import { isLeft, unwrapEither } from '@/shared/either/either';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { GetUsersByClinicIdUseCase } from '@/domain/application/use-cases/clinic/get-users-by-clinic-id';
import {
	Controller,
	Get,
	Inject,
	NotFoundException,
	Param,
} from '@nestjs/common';
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { UserPresenter } from '../../presenters/user-presenter';

const getUsersByClinicIdParamsSchema = z.object({
	clinicId: z.string().uuid(),
});

type GetUsersByClinicIdParamsSchema = z.infer<typeof getUsersByClinicIdParamsSchema>;

const getUsersByClinicIdParamsValidationPipe = new ZodValidationPipe(getUsersByClinicIdParamsSchema);

@ApiTags('Clinics')
@Controller('/clinics')
export class GetUsersByClinicIdController {
	constructor(
		@Inject(GetUsersByClinicIdUseCase)
		private readonly getUsersByClinicIdUseCase: GetUsersByClinicIdUseCase,
	) {}

	@Get('/:clinicId/users')
	@ApiOperation({
		summary: 'Get users by clinic',
		description: 'Retrieves all users registered in a specific clinic.',
	})
	@ApiParam({
		name: 'clinicId',
		type: String,
		description: 'Clinic identifier',
	})
	@ApiOkResponse({
		description: 'Users retrieved successfully',
	})
	@ApiNotFoundResponse({
		description: 'Clinic not found',
	})
	async handle(@Param(getUsersByClinicIdParamsValidationPipe) params: GetUsersByClinicIdParamsSchema) {
		const { clinicId } = params;

		const result = await this.getUsersByClinicIdUseCase.execute({ clinicId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ClinicNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { users } = unwrapEither(result);

		return users.map(UserPresenter.toHTTP);
	}
}


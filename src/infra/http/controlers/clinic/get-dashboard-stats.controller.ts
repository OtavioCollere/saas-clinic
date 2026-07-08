import { isLeft, unwrapEither } from '@/shared/either/either';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { GetDashboardStatsUseCase } from '@/domain/application/use-cases/clinic/get-dashboard-stats';
import { Controller, Get, Inject, NotFoundException, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

const getDashboardStatsParamsSchema = z.object({
  clinicId: z.string(),
});

type GetDashboardStatsParamsSchema = z.infer<typeof getDashboardStatsParamsSchema>;

const paramsValidationPipe = new ZodValidationPipe(getDashboardStatsParamsSchema);

@ApiTags('Clinics')
@Controller('/clinics')
export class GetDashboardStatsController {
  constructor(
    @Inject(GetDashboardStatsUseCase)
    private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase,
  ) {}

  @Get('/:clinicId/dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard stats for a clinic' })
  @ApiParam({ name: 'clinicId', type: String })
  @ApiOkResponse({ description: 'Dashboard stats retrieved successfully' })
  async handle(@Param(paramsValidationPipe) { clinicId }: GetDashboardStatsParamsSchema) {
    const result = await this.getDashboardStatsUseCase.execute({ clinicId });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case ClinicNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new NotFoundException(error.message);
      }
    }

    return unwrapEither(result);
  }
}

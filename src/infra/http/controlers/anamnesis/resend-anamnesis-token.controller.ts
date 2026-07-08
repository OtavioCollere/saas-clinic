import {
  Controller,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import z from 'zod'
import { isLeft, unwrapEither } from '@/shared/either/either'
import { PatientNotFoundError } from '@/shared/errors/patient-not-found-error'
import { ResendAnamnesisTokenUseCase } from '@/domain/application/use-cases/anamnesis/resend-anamnesis-token'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const paramsSchema = z.object({ patientId: z.string() })
type Params = z.infer<typeof paramsSchema>
const paramsPipe = new ZodValidationPipe(paramsSchema)

@ApiTags('Anamnesis Token')
@Controller('/patients')
export class ResendAnamnesisTokenController {
  constructor(
    @Inject(ResendAnamnesisTokenUseCase)
    private readonly resendAnamnesisTokenUseCase: ResendAnamnesisTokenUseCase,
  ) {}

  @Post('/:patientId/anamnesis-token/resend')
  @HttpCode(202)
  @ApiOperation({ summary: 'Resend anamnesis token link to patient' })
  async resend(@Param(paramsPipe) { patientId }: Params) {
    const result = await this.resendAnamnesisTokenUseCase.execute({ patientId })

    if (isLeft(result)) {
      const error = unwrapEither(result)
      if (error instanceof PatientNotFoundError) {
        throw new NotFoundException(error.message)
      }
      throw new NotFoundException(error.message)
    }

    return { success: true }
  }
}

import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  GoneException,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { InvalidAnamnesisTokenError } from '@/shared/errors/invalid-anamnesis-token-error'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import z from 'zod'
import { Public } from '@/infra/auth/public'
import { isLeft, unwrapEither } from '@/shared/either/either'
import { AESTHETIC_REGIONS, AestheticRegionType } from '@/domain/enterprise/value-objects/aesthetic-region'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ValidateAnamnesisTokenUseCase } from '@/domain/application/use-cases/anamnesis/validate-anamnesis-token'
import { SubmitAnamnesisViaTokenUseCase } from '@/domain/application/use-cases/anamnesis/submit-anamnesis-via-token'

const tokenParamSchema = z.object({ token: z.string().uuid() })
type TokenParam = z.infer<typeof tokenParamSchema>
const tokenParamPipe = new ZodValidationPipe(tokenParamSchema)

type AestheticRegion = typeof AESTHETIC_REGIONS[number]
const regionEnum = z.enum(AESTHETIC_REGIONS as unknown as [AestheticRegion, ...AestheticRegion[]]).optional()

const submitBodySchema = z.object({
  aestheticHistory: z.object({
    hadPreviousAestheticTreatment: z.boolean(),
    botulinumToxin: z.boolean(),
    botulinumRegion: regionEnum,
    filler: z.boolean(),
    fillerRegion: regionEnum,
    fillerProduct: z.string().optional(),
    suspensionThreads: z.boolean(),
    suspensionThreadsRegion: regionEnum,
    suspensionThreadsProduct: z.string().optional(),
    surgicalLift: z.boolean(),
    surgicalLiftRegion: regionEnum,
    surgicalLiftProduct: z.string().optional(),
    chemicalPeeling: z.boolean(),
    chemicalPeelingRegion: regionEnum,
    chemicalPeelingProduct: z.string().optional(),
    laser: z.boolean(),
    laserRegion: regionEnum,
    laserProduct: z.string().optional(),
    exposedToHeatOrColdWork: z.boolean(),
  }),
  healthConditions: z.any(),
  medicalHistory: z.any(),
  physicalAssessment: z.object({
    bloodPressure: z.string().min(1),
    height: z.number().positive(),
    initialWeight: z.number().positive(),
    finalWeight: z.number().positive().optional(),
  }),
  patientSignature: z.string().min(1),
})

type SubmitBody = z.infer<typeof submitBodySchema>
const submitBodyPipe = new ZodValidationPipe(submitBodySchema)

@ApiTags('Anamnesis Token')
@Controller('/anamnesis/token')
export class AnamnesisTokenController {
  constructor(
    @Inject(ValidateAnamnesisTokenUseCase)
    private readonly validateAnamnesisTokenUseCase: ValidateAnamnesisTokenUseCase,
    @Inject(SubmitAnamnesisViaTokenUseCase)
    private readonly submitAnamnesisViaTokenUseCase: SubmitAnamnesisViaTokenUseCase,
  ) {}

  @Public()
  @Get('/:token')
  @ApiOperation({ summary: 'Validate anamnesis token' })
  async validate(@Param(tokenParamPipe) { token }: TokenParam) {
    const result = await this.validateAnamnesisTokenUseCase.execute({ token })

    if (isLeft(result)) {
      const error = unwrapEither(result)
      const code = error instanceof InvalidAnamnesisTokenError ? error.code : 'NOT_FOUND'
      if (code === 'EXPIRED') throw new GoneException({ errorCode: 'EXPIRED' })
      if (code === 'ALREADY_USED') throw new ConflictException({ errorCode: 'ALREADY_USED' })
      throw new NotFoundException({ errorCode: code })
    }

    const { patientId, patientName, expiresAt } = unwrapEither(result)

    return { success: true, data: { patientId, patientName, expiresAt } }
  }

  @Public()
  @Post('/:token')
  @ApiOperation({ summary: 'Submit anamnesis via token' })
  async submit(
    @Param(tokenParamPipe) { token }: TokenParam,
    @Body(submitBodyPipe) body: SubmitBody,
  ) {
    const result = await this.submitAnamnesisViaTokenUseCase.execute({
      token,
      ...body,
    })

    if (isLeft(result)) {
      throw new BadRequestException('Token inválido ou expirado')
    }

    return { success: true }
  }
}

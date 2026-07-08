import { isLeft, unwrapEither } from '@/shared/either/either';
import { OnboardClinicUseCase } from '@/domain/application/use-cases/admin/onboard-clinic';
import { EmailAlreadyExistsError } from '@/shared/errors/email-already-exists-error';
import { CpfAlreadyExistsError } from '@/shared/errors/cpf-already-exists-error';
import { CnpjAlreadyExistsError } from '@/shared/errors/cnpj-already-exists-error';
import { ClinicAlreadyExistsError } from '@/shared/errors/clinic-already-exists-error';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  Inject,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { Public } from '@/infra/auth/public';
import { InvalidCpfError } from '@/shared/errors/invalid-cpf-error';
import { InvalidEmailError } from '@/shared/errors/invalid-email-error';
import { InvalidCnpjError } from '@/shared/errors/invalid-cnpj-error';

const franchiseSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  zipCode: z.string().min(8),
  description: z.string().optional(),
});

const professionalSchema = z.object({
  name: z.string().min(2),
  cpf: z.string().min(11),
  email: z.string().email(),
  franchiseIndex: z.number().int().min(0),
  profession: z.enum(['MEDICO', 'BIOMEDICO']),
  council: z.enum(['CRM', 'CRBM']).optional(),
  councilNumber: z.string().optional(),
  councilState: z.string().optional(),
});

const bodySchema = z.object({
  clinicName: z.string().min(2),
  cnpj: z.string().min(14),
  ownerName: z.string().min(2),
  ownerCpf: z.string().min(11),
  ownerEmail: z.string().email(),
  franchises: z.array(franchiseSchema).optional().default([]),
  professionals: z.array(professionalSchema).optional().default([]),
});

type BodySchema = z.infer<typeof bodySchema>;
const bodyPipe = new ZodValidationPipe(bodySchema);

@Public()
@ApiTags('Admin')
@Controller('/admin')
export class OnboardClinicController {
  constructor(
    @Inject(OnboardClinicUseCase)
    private readonly onboardClinicUseCase: OnboardClinicUseCase,
  ) {}

  @Post('/onboard-clinic')
  @HttpCode(201)
  async handle(
    @Body(bodyPipe) body: BodySchema,
    @Headers('x-admin-key') adminKey: string,
  ) {
    const expectedKey = process.env.ADMIN_API_KEY;
    if (!expectedKey || adminKey !== expectedKey) {
      throw new ForbiddenException('Chave de administrador inválida.');
    }

    const result = await this.onboardClinicUseCase.execute(body);

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case InvalidEmailError:
        case InvalidCpfError:
        case InvalidCnpjError:
          throw new UnprocessableEntityException(error.message);
        case EmailAlreadyExistsError:
        case CpfAlreadyExistsError:
        case CnpjAlreadyExistsError:
        case ClinicAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { clinicId, clinicSlug, userId, email } = unwrapEither(result);
    return { clinicId, clinicSlug, userId, email, message: 'Clínica criada com sucesso. Credenciais enviadas por email.' };
  }
}

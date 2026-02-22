import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeRight } from '@/shared/either/either';
import type { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentsRepository } from '../../repositories/appointments-repository';

interface FetchAppointmentsByProfessionalIdUseCaseRequest {
  professionalId: string;
}

type FetchAppointmentsByProfessionalIdUseCaseResponse = Either<
  never,
  { appointments: Appointment[] }
>;

@Injectable()
export class FetchAppointmentsByProfessionalIdUseCase {
  constructor(
    @Inject(AppointmentsRepository)
    private readonly appointmentsRepository: AppointmentsRepository
  ) {}

  async execute({ professionalId }: FetchAppointmentsByProfessionalIdUseCaseRequest): Promise<FetchAppointmentsByProfessionalIdUseCaseResponse> {
    const appointments = await this.appointmentsRepository.findByProfessionalId(professionalId);
    return makeRight({ appointments });
  }
}

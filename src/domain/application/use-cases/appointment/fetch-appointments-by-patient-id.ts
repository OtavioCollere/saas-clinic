import { type Either, makeRight } from '@/core/either/either';
import type { Appointment } from '@/domain/enterprise/entities/appointment';
import type { AppointmentsRepository } from '../../repositories/appointments-repository';

interface FetchAppointmentsByPatientIdUseCaseRequest {
  patientId: string;
}

type FetchAppointmentsByPatientIdUseCaseResponse = Either<
  never,
  {
    appointments: Appointment[];
  }
>;

export class FetchAppointmentsByPatientIdUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository
  ) {}

  async execute({ patientId }: FetchAppointmentsByPatientIdUseCaseRequest): Promise<FetchAppointmentsByPatientIdUseCaseResponse> {
    const appointments = await this.appointmentsRepository.findByPatientId(patientId);

    return makeRight({
      appointments,
    });
  }
}

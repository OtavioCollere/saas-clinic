import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import type { AppointmentProps } from '@/domain/enterprise/entities/appointment';
import { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';
import { AppointmentItem } from '@/domain/enterprise/entities/appointment-item';

export function makeAppointment(override: Partial<AppointmentProps> = {}): Appointment {
  const startAt = override.startAt ?? new Date();
  const durationInMinutes = override.durationInMinutes ?? 60;
  const endAt = new Date(startAt.getTime() + durationInMinutes * 60000);

  const appointment = Appointment.create({
    professionalId: new UniqueEntityId(),
    franchiseId: new UniqueEntityId(),
    patientId: new UniqueEntityId(),
    name: 'Appointment Name',
    durationInMinutes,
    appointmentItems: [],
    startAt,
    endAt,
    status: AppointmentStatus.waiting(),
    ...override,
  });

  return appointment;
}

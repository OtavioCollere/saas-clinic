import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import type { PatientProps } from '@/domain/enterprise/entities/patient';
import { Patient } from '@/domain/enterprise/entities/patient';

export function makePatient(override: Partial<PatientProps> = {}): Patient {
  const patient = Patient.create({
    clinicId: new UniqueEntityId(),
    userId: new UniqueEntityId(),
    name: 'John Doe',
    birthDay: new Date('1990-01-01'),
    address: '123 Main St',
    zipCode: '12345-678',
    ...override,
  });

  return patient;
}

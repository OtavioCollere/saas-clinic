import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Anamnesis } from '@/domain/enterprise/entities/anamnesis/anamnesis';
import type { PatientProps } from '@/domain/enterprise/entities/patient';
import { Patient } from '@/domain/enterprise/entities/patient';
import { makeAnamnesis } from './makeAnamnesis';

export function makePatient(override: Partial<PatientProps> = {}): Patient {
  const anamnesis = override.anamnesis ?? makeAnamnesis();

  const patient = Patient.create({
    clinicId: new UniqueEntityId(),
    userId: new UniqueEntityId(),
    anamnesis,
    name: 'John Doe',
    birthDay: new Date('1990-01-01'),
    address: '123 Main St',
    zipCode: '12345-678',
    ...override,
  });

  return patient;
}

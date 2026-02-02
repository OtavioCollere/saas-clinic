import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { Clinic, type ClinicProps } from '@/domain/enterprise/entities/clinic';
import { Slug } from '@/domain/enterprise/value-objects/slug';

export function makeClinic(override: Partial<ClinicProps> = {}): Clinic {
  const clinic = Clinic.create({
    name: 'Clinic Example',
    ownerId: new UniqueEntityId(),
    description: 'Example clinic description',
    ...override,
  });

  return clinic;
}

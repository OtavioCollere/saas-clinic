import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { ClinicMembership, type ClinicMembershipProps } from '@/domain/enterprise/entities/clinic-membership';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';

export function makeClinicMembership(override: Partial<ClinicMembershipProps> = {}): ClinicMembership {
  const membership = ClinicMembership.create({
    userId: new UniqueEntityId(),
    clinicId: new UniqueEntityId(),
    role: ClinicRole.owner(),
    ...override,
  });

  return membership;
}


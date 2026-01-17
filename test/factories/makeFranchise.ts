import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Franchise, type FranchiseProps } from '@/domain/enterprise/entities/franchise';
import { FranchiseStatus } from '@/domain/enterprise/value-objects/franchise-status';

export function makeFranchise(override: Partial<FranchiseProps> = {}): Franchise {
  const franchise = Franchise.create({
    clinicId: new UniqueEntityId(),
    name: 'Franchise Example',
    address: '123 Main St',
    zipCode: '12345-678',
    status: FranchiseStatus.active(),
    description: 'Example franchise description',
    ...override,
  });

  return franchise;
}


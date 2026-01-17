import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Professional, type ProfessionalProps } from '@/domain/enterprise/entities/professional';
import { Council } from '@/domain/enterprise/value-objects/council';
import { Profession } from '@/domain/enterprise/value-objects/profession';

export function makeProfessional(override: Partial<ProfessionalProps> = {}): Professional {
  const professional = Professional.create({
    franchiseId: new UniqueEntityId(),
    userId: new UniqueEntityId(),
    council: Council.crm(),
    councilNumber: '123456',
    councilState: 'SP',
    profession: Profession.medico(),
    ...override,
  });

  return professional;
}


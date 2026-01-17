import type { Professional } from '@/domain/enterprise/entities/professional';

export abstract class ProfessionalRepository {
  abstract create(professional: Professional): Promise<Professional>;
  abstract findById(id: string): Promise<Professional | null>;
  abstract findByUserIdAndFranchiseId(
    userId: string,
    franchiseId: string
  ): Promise<Professional | null>;
  abstract findByFranchiseId(franchiseId: string): Promise<Professional[]>;
  abstract update(professional: Professional): Promise<Professional>;
}

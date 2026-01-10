import type { Franchise } from "@/domain/enterprise/entities/franchise";

export abstract class FranchiseRepository {
  abstract create(franchise: Franchise): Promise<Franchise>;
  abstract findById(id: string): Promise<Franchise | null>;
  abstract findByClinicId(clinicId: string): Promise<Franchise[]>;
  abstract update(franchise: Franchise): Promise<Franchise>;
}
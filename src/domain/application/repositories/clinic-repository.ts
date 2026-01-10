import type { PaginationParams } from "@/core/types/pagination-params";
import type { Clinic } from "@/domain/enterprise/entities/clinic";

export abstract class ClinicRepository{
  abstract create(clinic: Clinic): Promise<Clinic>;
  abstract findById(id: string): Promise<Clinic | null>;
  abstract findBySlug(slug: string): Promise<Clinic | null>;
  abstract findByOwnerId(ownerId: string): Promise<Clinic | null>;
  abstract update(clinic: Clinic): Promise<Clinic>;
  abstract delete(id: string): Promise<void>;
  abstract fetch({query, page, pageSize} : PaginationParams): Promise<Clinic[]>
}
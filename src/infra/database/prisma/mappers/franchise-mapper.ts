import { Franchise } from "@/domain/enterprise/entities/franchise";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { FranchiseStatus } from "@/domain/enterprise/value-objects/franchise-status";

type FranchiseRaw = {
  id: string;
  clinicId: string;
  name: string;
  address: string;
  zipCode: string;
  status: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

type FranchisePrismaInput = {
  id: string;
  clinicId: string;
  name: string;
  address: string;
  zipCode: string;
  status: string;
  description?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
};

export class FranchiseMapper {
  static toDomain(raw: FranchiseRaw): Franchise {
    const status = raw.status === 'ACTIVE' 
      ? FranchiseStatus.active() 
      : FranchiseStatus.inactive();

    return Franchise.create(
      {
        clinicId: new UniqueEntityId(raw.clinicId),
        name: raw.name,
        address: raw.address,
        zipCode: raw.zipCode,
        status,
        description: raw.description ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(franchise: Franchise): FranchisePrismaInput {
    return {
      id: franchise.id.toString(),
      clinicId: franchise.clinicId.toString(),
      name: franchise.name,
      address: franchise.address,
      zipCode: franchise.zipCode,
      status: franchise.status.getValue(),
      description: franchise.description ?? null,
      createdAt: franchise.createdAt,
      updatedAt: franchise.updatedAt ?? null,
    };
  }
}


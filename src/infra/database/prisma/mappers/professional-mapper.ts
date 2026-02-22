import { Professional } from "@/domain/enterprise/entities/professional";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { Council } from "@/domain/enterprise/value-objects/council";
import { Profession } from "@/domain/enterprise/value-objects/profession";

type ProfessionalRaw = {
  id: string;
  franchiseId: string;
  userId: string;
  council: string | null;
  councilNumber: string | null;
  councilState: string | null;
  profession: string;
  createdAt: Date;
  updatedAt: Date | null;
};

type ProfessionalPrismaCreateInput = {
  id: string;
  franchise: {
    connect: {
      id: string;
    };
  };
  user: {
    connect: {
      id: string;
    };
  };
  council?: string | null;
  councilNumber?: string | null;
  councilState?: string | null;
  profession: string;
  createdAt: Date;
  // updatedAt não é incluído na criação - Prisma gerencia automaticamente com @updatedAt
};

type ProfessionalPrismaUpdateInput = {
  council?: string | null;
  councilNumber?: string | null;
  councilState?: string | null;
  profession?: string;
  updatedAt?: Date | null;
};

export class ProfessionalMapper {
  static toDomain(raw: ProfessionalRaw): Professional {
    const council = raw.council 
      ? (raw.council === 'CRM' ? Council.crm() : Council.crbm())
      : undefined;

    const profession = raw.profession === 'MEDICO'
      ? Profession.medico()
      : Profession.biomedico();

    return Professional.create(
      {
        franchiseId: new UniqueEntityId(raw.franchiseId),
        userId: new UniqueEntityId(raw.userId),
        council,
        councilNumber: raw.councilNumber ?? undefined,
        councilState: raw.councilState ?? undefined,
        profession,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(professional: Professional): ProfessionalPrismaCreateInput {
    return {
      id: professional.id.toString(),
      franchise: {
        connect: {
          id: professional.franchiseId.toString(),
        },
      },
      user: {
        connect: {
          id: professional.userId.toString(),
        },
      },
      council: professional.council?.getValue() ?? null,
      councilNumber: professional.councilNumber ?? null,
      councilState: professional.councilState ?? null,
      profession: professional.profession.getValue(),
      createdAt: professional.createdAt,
      // updatedAt não é incluído - Prisma gerencia automaticamente com @updatedAt
    };
  }

  static toPrismaUpdate(professional: Professional): ProfessionalPrismaUpdateInput {
    return {
      council: professional.council?.getValue() ?? null,
      councilNumber: professional.councilNumber ?? null,
      councilState: professional.councilState ?? null,
      profession: professional.profession.getValue(),
      updatedAt: professional.updatedAt ?? null,
    };
  }
}


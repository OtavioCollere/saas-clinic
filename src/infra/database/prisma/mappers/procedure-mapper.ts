import { Procedure } from "@/domain/enterprise/entities/procedure";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { ProcedureStatus } from "@/domain/enterprise/value-objects/procedure-status";

type ProcedureRaw = {
  id: string;
  franchiseId: string;
  name: string;
  price: number | string;
  notes: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
};

type ProcedurePrismaCreateInput = {
  id: string;
  franchise: {
    connect: {
      id: string;
    };
  };
  name: string;
  price: number | string;
  notes?: string | null;
  status: string;
  createdAt: Date;
};

type ProcedurePrismaUpdateInput = {
  name?: string;
  price?: number | string;
  notes?: string | null;
  status?: string;
  updatedAt?: Date;
};

export class ProcedureMapper {
  static toDomain(raw: ProcedureRaw): Procedure {
    const status = raw.status === 'ACTIVE' 
      ? ProcedureStatus.active() 
      : ProcedureStatus.inactive();

    const price = typeof raw.price === 'string' 
      ? parseFloat(raw.price) 
      : raw.price;

    return Procedure.create(
      {
        franchiseId: new UniqueEntityId(raw.franchiseId),
        name: raw.name,
        price,
        notes: raw.notes ?? undefined,
        status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(procedure: Procedure): ProcedurePrismaCreateInput {
    return {
      id: procedure.id.toString(),
      franchise: {
        connect: {
          id: procedure.franchiseId.toString(),
        },
      },
      name: procedure.name,
      price: procedure.price,
      notes: procedure.notes ?? null,
      status: procedure.status.getValue(),
      createdAt: procedure.createdAt,
    };
  }

  static toPrismaUpdate(procedure: Procedure): ProcedurePrismaUpdateInput {
    return {
      name: procedure.name,
      price: procedure.price,
      notes: procedure.notes ?? null,
      status: procedure.status.getValue(),
      updatedAt: new Date(),
    };
  }
}


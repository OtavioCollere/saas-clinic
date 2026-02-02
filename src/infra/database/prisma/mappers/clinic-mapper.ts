import { Clinic } from "@/domain/enterprise/entities/clinic";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { Slug } from "@/domain/enterprise/value-objects/slug";
import { ClinicStatus } from "@/domain/enterprise/value-objects/clinic-status";
// NOTE: As tabelas Clinic ainda não existem no schema.prisma
// Este mapper será usado quando as tabelas forem criadas
type ClinicRaw = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  avatarUrl: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
};

type ClinicPrismaInput = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description?: string | null;
  avatarUrl?: string | null;
  status: string;
  createdAt: Date;
};

export class ClinicMapper {
  static toDomain(raw: ClinicRaw): Clinic {
    return Clinic.create(
      {
        ownerId: new UniqueEntityId(raw.ownerId),
        name: raw.name,
        slug: Slug.create(raw.slug),
        description: raw.description ?? undefined,
        avatarUrl: raw.avatarUrl ?? undefined,
        status: ClinicStatus.active(), // TODO: mapear corretamente quando schema estiver pronto
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(clinic: Clinic): ClinicPrismaInput {
    return {
      id: clinic.id.toString(),
      ownerId: clinic.ownerId.toString(),
      name: clinic.name,
      slug: clinic.slug.getValue(),
      description: clinic.description ?? null,
      avatarUrl: clinic.avatarUrl ?? null,
      status: clinic.status.getValue(),
      createdAt: clinic.createdAt,
    };
  }
}



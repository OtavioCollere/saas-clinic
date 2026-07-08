import { ClinicMembership } from "@/domain/enterprise/entities/clinic-membership";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { ClinicRole } from "@/domain/enterprise/value-objects/clinic-role";

type ClinicMembershipRaw = {
  id: string;
  userId: string;
  clinicId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date | null;
};

type ClinicMembershipPrismaInput = {
  id: string;
  userId: string;
  clinicId: string;
  role: string;
  createdAt: Date;
  updatedAt?: Date | null;
};

export class ClinicMembershipMapper {
  static toDomain(raw: ClinicMembershipRaw): ClinicMembership {
    return ClinicMembership.create(
      {
        userId: new UniqueEntityId(raw.userId),
        clinicId: new UniqueEntityId(raw.clinicId),
        role: new ClinicRole(raw.role as 'ADMIN' | 'OWNER' | 'PROFESSIONAL' | 'PATIENT'),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(membership: ClinicMembership): ClinicMembershipPrismaInput {
    return {
      id: membership.id.toString(),
      userId: membership.userId.toString(),
      clinicId: membership.clinicId.toString(),
      role: membership.role.getValue(),
      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt ?? null,
    };
  }
}


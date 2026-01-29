import { User } from "@/domain/enterprise/entities/user";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Cpf } from "@/domain/enterprise/value-objects/cpf";
import { Email } from "@/domain/enterprise/value-objects/email";
import { UserRole } from "@/domain/enterprise/value-objects/user-role";
import type { Prisma } from "@prisma/client";

export class UserMapper {
  static toDomain(raw: Prisma.UserGetPayload<{}>): User {
    return User.create(
      {
        name: raw.name,
        cpf: Cpf.create(raw.cpf),
        email: Email.create(raw.email),
        password: raw.password,
        isEmailVerified: raw.isEmailVerified,
        role: new UserRole(raw.role as "ADMIN" | "MEMBER"),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      cpf: user.cpf.getValue(),
      email: user.email.getValue(),
      password: user.password,
      isEmailVerified: user.isEmailVerified,
      role: user.role.getValue(),
      createdAt: user.createdAt,
      // updatedAt é omitido - Prisma gerencia automaticamente com @updatedAt
    };
  }
}


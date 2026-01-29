import { Inject, Injectable } from "@nestjs/common";
import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { User } from "@/domain/enterprise/entities/user";
import { PrismaService } from "../../prisma.service";
import { UserMapper } from "../mappers/user-mapper";

@Injectable()
export class PrismaUsersRepository extends UsersRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService) {
    super();
  }

  async create(user: User): Promise<User> {
    const data = UserMapper.toPrisma(user);

    const raw = await this.prisma.user.create({
      data,
    });

    return UserMapper.toDomain(raw);
  }

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!raw) return null;

    return UserMapper.toDomain(raw);
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    
    const raw = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!raw) return null;

    return UserMapper.toDomain(raw);
  }

  async update(user: User): Promise<User> {
    const data = UserMapper.toPrisma(user);

    const raw = await this.prisma.user.update({
      where: { id: user.id.toString() },
      data: {
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        password: data.password,
        isEmailVerified: data.isEmailVerified,
        role: data.role,
        // updatedAt é gerenciado automaticamente pelo Prisma com @updatedAt
      },
    });

    return UserMapper.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({
      where: { cpf },
    });

    if (!raw) return null;

    return UserMapper.toDomain(raw);
  }
}


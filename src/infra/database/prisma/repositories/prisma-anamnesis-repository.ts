import { Inject, Injectable } from "@nestjs/common";
import { AnamnesisRepository } from "@/domain/application/repositories/anamnesis-repository";
import { Anamnesis } from "@/domain/enterprise/entities/anamnesis/anamnesis";
import { PrismaService } from "../../prisma.service";
import { AnamnesisMapper } from "../mappers/anamnesis-mapper";

@Injectable()
export class PrismaAnamnesisRepository extends AnamnesisRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(anamnesis: Anamnesis): Promise<Anamnesis> {
    const data = AnamnesisMapper.toPrisma(anamnesis);
    const raw = await this.prisma.anamnesis.create({ data });
    return AnamnesisMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Anamnesis | null> {
    const raw = await this.prisma.anamnesis.findUnique({ where: { id } });
    if (!raw) return null;
    return AnamnesisMapper.toDomain(raw);
  }

  async findByPatientId(patientId: string): Promise<Anamnesis | null> {
    const raw = await this.prisma.anamnesis.findUnique({
      where: { patientId },
    });
    if (!raw) return null;
    return AnamnesisMapper.toDomain(raw);
  }

  async update(anamnesis: Anamnesis): Promise<Anamnesis> {
    const data = AnamnesisMapper.toPrismaUpdate(anamnesis);
    const raw = await this.prisma.anamnesis.update({
      where: { id: anamnesis.id.toString() },
      data,
    });
    return AnamnesisMapper.toDomain(raw);
  }
}


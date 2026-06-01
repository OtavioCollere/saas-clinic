import { Inject, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { AnamnesisRepository } from '@/domain/application/repositories/anamnesis-repository'
import { Anamnesis } from '@/domain/enterprise/entities/anamnesis/anamnesis'
import { PrismaService } from '../../prisma.service'
import { AnamnesisMapper } from '../mappers/anamnesis-mapper'

@Injectable()
export class PrismaAnamnesisRepository extends AnamnesisRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {
    super()
  }

  async create(anamnesis: Anamnesis): Promise<Anamnesis> {
    const data = AnamnesisMapper.toPrisma(anamnesis)
    const raw = await this.prisma.anamnesis.create({
      data: data as unknown as Prisma.AnamnesisCreateInput,
    })
    return AnamnesisMapper.toDomain(raw)
  }

  async findById(id: string): Promise<Anamnesis | null> {
    const raw = await this.prisma.anamnesis.findUnique({ where: { id } })
    return raw ? AnamnesisMapper.toDomain(raw) : null
  }

  async findByPatientId(patientId: string): Promise<Anamnesis | null> {
    const raw = await this.prisma.anamnesis.findUnique({
      where: { patientId },
    })
    return raw ? AnamnesisMapper.toDomain(raw) : null
  }

  async update(anamnesis: Anamnesis): Promise<Anamnesis> {
    const data = AnamnesisMapper.toPrisma(anamnesis)
    const { id, ...updateData } = data
    const raw = await this.prisma.anamnesis.update({
      where: { id },
      data: updateData as unknown as Prisma.AnamnesisUpdateInput,
    })
    return AnamnesisMapper.toDomain(raw)
  }
}

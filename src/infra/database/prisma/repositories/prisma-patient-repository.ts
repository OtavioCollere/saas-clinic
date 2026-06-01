import { Inject, Injectable } from "@nestjs/common";
import { PatientRepository } from "@/domain/application/repositories/patient-repository";
import { Patient } from "@/domain/enterprise/entities/patient";
import { PrismaService } from "../../prisma.service";
import { PatientMapper } from "../mappers/patient-mapper";
import type { PaginationParams } from "@/shared/types/pagination-params";
@Injectable()
export class PrismaPatientRepository extends PatientRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(patient: Patient): Promise<Patient> {
    const data = PatientMapper.toPrisma(patient);
    const raw = await this.prisma.patient.create({
      data,
    });
    return PatientMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Patient | null> {
    const raw = await this.prisma.patient.findUnique({
      where: { id },
    });
    if (!raw) return null;
    return PatientMapper.toDomain(raw);
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    const raw = await this.prisma.patient.findFirst({
      where: { userId },
    });
    if (!raw) return null;
    return PatientMapper.toDomain(raw);
  }

  async findByUserIdAndClinicId(userId: string, clinicId: string): Promise<Patient | null> {
    const raw = await this.prisma.patient.findFirst({
      where: { userId, clinicId },
    });
    if (!raw) return null;
    return PatientMapper.toDomain(raw);
  }

  async findByClinicId(clinicId: string): Promise<Patient[]> {
    const raw = await this.prisma.patient.findMany({
      where: { clinicId },
      orderBy: { createdAt: "desc" },
      include: { anamnesis: true },
    });
    return raw.map(PatientMapper.toDomain);
  }

  async update(patient: Patient): Promise<Patient> {
    const data = PatientMapper.toPrisma(patient);
    const raw = await this.prisma.patient.update({
      where: { id: patient.id.toString() },
      data: {
        clinicId: data.clinicId,
        userId: data.userId,
        name: data.name,
        birthDay: data.birthDay,
        address: data.address,
        zipCode: data.zipCode,
      },
    });
    return PatientMapper.toDomain(raw);
  }

  async countByClinicId(clinicId: string): Promise<number> {
    return this.prisma.patient.count({ where: { clinicId } });
  }

  async countByClinicIdCreatedBefore(clinicId: string, date: Date): Promise<number> {
    return this.prisma.patient.count({
      where: { clinicId, createdAt: { lt: date } },
    });
  }

  async fetch({ query, page, pageSize }: PaginationParams): Promise<Patient[]> {
    const skip = (page - 1) * pageSize;
    const where = query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { address: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {};

    const raw = await this.prisma.patient.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
    return raw.map(PatientMapper.toDomain);
  }
}


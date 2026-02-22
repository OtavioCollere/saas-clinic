import { Inject, Injectable } from "@nestjs/common";
import { PatientRepository } from "@/domain/application/repositories/patient-repository";
import { Patient } from "@/domain/enterprise/entities/patient";
import { PrismaService } from "../../prisma.service";
import { PatientMapper } from "../mappers/patient-mapper";
import type { PaginationParams } from "@/shared/types/pagination-params";
import type { Prisma } from "@prisma/client";

@Injectable()
export class PrismaPatientRepository extends PatientRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(patient: Patient, tx?: unknown): Promise<Patient> {
    const data = PatientMapper.toPrisma(patient);
    const prismaClient = (tx as Prisma.TransactionClient) || this.prisma;
    
    const raw = await prismaClient.patient.create({ data });
    return PatientMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Patient | null> {
    const raw = await this.prisma.patient.findUnique({ where: { id } });
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

  async findByClinicId(clinicId: string): Promise<Patient[]> {
    const raw = await this.prisma.patient.findMany({
      where: { clinicId },
      orderBy: { createdAt: 'desc' },
    });
    return raw.map(PatientMapper.toDomain);
  }

  async fetchByClinicId(clinicId: string, { query, page, pageSize }: PaginationParams): Promise<import('@/domain/application/repositories/patient-repository').PatientWithUserData[]> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where: Prisma.PatientWhereInput = {
      clinicId,
      ...(query
        ? {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          }
        : {}),
    };

    const raw = await this.prisma.patient.findMany({
      where,
      skip,
      take,
      orderBy: { name: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            cpf: true,
            email: true,
            isEmailVerified: true,
          },
        },
        clinic: {
          select: {
            franchises: {
              take: 1,
              where: {
                status: 'ACTIVE',
              },
              orderBy: { createdAt: 'asc' },
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        anamnesis: {
          select: {
            id: true,
          },
        },
      },
    });

    return raw.map((item) => {
      const patient = PatientMapper.toDomain(item);
      const firstFranchise = item.clinic.franchises && item.clinic.franchises.length > 0 ? item.clinic.franchises[0] : null;
      const hasAnamnesis = !!item.anamnesis;
      
      return {
        patient,
        userData: {
          cpf: item.user.cpf,
          email: item.user.email,
          isEmailVerified: item.user.isEmailVerified,
        },
        franchiseName: firstFranchise?.name || undefined,
        franchiseId: firstFranchise?.id || undefined,
        anamneseId: item.anamnesis?.id || undefined,
        isAnamneseDone: hasAnamnesis,
      };
    });
  }

  async update(patient: Patient): Promise<Patient> {
    const data = PatientMapper.toPrismaUpdate(patient);
    const raw = await this.prisma.patient.update({
      where: { id: patient.id.toString() },
      data,
    });
    return PatientMapper.toDomain(raw);
  }

  async fetch({ query, page, pageSize }: PaginationParams): Promise<Patient[]> {
    const where = query
      ? {
          name: {
            contains: query,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const raw = await this.prisma.patient.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    return raw.map(PatientMapper.toDomain);
  }
}


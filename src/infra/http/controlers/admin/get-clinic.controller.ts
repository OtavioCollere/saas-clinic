import {
  Controller,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import type { UserPayload } from '@/infra/auth/jwt-strategy';
import { PrismaService } from '@/infra/database/prisma.service';

interface AdminRequest extends FastifyRequest {
  user?: UserPayload;
}

@ApiTags('Admin')
@Controller('/admin')
export class GetClinicController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get('/clinics/:clinicId')
  async handle(@Req() req: AdminRequest, @Param('clinicId') clinicId: string) {
    const payload = req.user;
    if (!payload?.sub) throw new UnauthorizedException();
    if (payload.role !== 'ADMIN') throw new ForbiddenException();

    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
      include: {
        owner: { select: { id: true, name: true, email: true, cpf: true, phone: true } },
        franchises: {
          orderBy: { createdAt: 'asc' },
          select: { id: true, name: true, address: true, zipCode: true, status: true, createdAt: true },
        },
        _count: { select: { patients: true } },
      },
    });

    if (!clinic) throw new NotFoundException('Clínica não encontrada.');

    return {
      id: clinic.id,
      name: clinic.name,
      slug: clinic.slug,
      cnpj: clinic.cnpj,
      status: clinic.status,
      createdAt: clinic.createdAt,
      owner: clinic.owner,
      franchises: clinic.franchises,
      patientCount: clinic._count.patients,
    };
  }
}

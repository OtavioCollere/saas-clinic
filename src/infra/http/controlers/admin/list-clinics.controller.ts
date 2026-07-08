import {
  Controller,
  ForbiddenException,
  Get,
  Inject,
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
export class ListClinicsController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get('/clinics')
  async handle(@Req() req: AdminRequest) {
    const payload = req.user;
    if (!payload?.sub) throw new UnauthorizedException();
    if (payload.role !== 'ADMIN') throw new ForbiddenException();

    const clinics = await this.prisma.clinic.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { franchises: true, patients: true } },
      },
    });

    return clinics.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      cnpj: c.cnpj,
      status: c.status,
      createdAt: c.createdAt,
      owner: c.owner,
      franchiseCount: c._count.franchises,
      patientCount: c._count.patients,
    }));
  }
}

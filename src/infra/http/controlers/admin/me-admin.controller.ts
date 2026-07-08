import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import type { UserPayload } from '@/infra/auth/jwt-strategy';

interface AuthenticatedRequest extends FastifyRequest {
  user?: UserPayload;
}

@ApiTags('Admin')
@Controller('/admin')
export class MeAdminController {
  @Get('/me')
  handle(@Req() req: AuthenticatedRequest) {
    const payload = req.user;

    if (!payload?.sub) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (payload.role !== 'ADMIN') {
      throw new ForbiddenException('Acesso restrito a administradores.');
    }

    return { id: payload.sub, role: payload.role };
  }
}

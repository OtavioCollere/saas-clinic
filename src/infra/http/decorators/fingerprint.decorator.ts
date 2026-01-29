import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export interface Fingerprint {
  ip: string
  userAgent: string
}

export const Fingerprint = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Fingerprint => {
    const req = ctx.switchToHttp().getRequest<Request>()

    const forwarded = req.headers['x-forwarded-for']

    const ip =
      typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : req.ip ?? '0.0.0.0'

    return {
      ip,
      userAgent: req.headers['user-agent'] ?? 'unknown',
    }
  },
)

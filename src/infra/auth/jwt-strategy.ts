import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  role: z.enum(['ADMIN', 'MEMBER']).optional(),
  clinicId: z.string().uuid().optional(),
  clinicMembershipId: z.string().uuid().optional(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const publicKey = process.env.JWT_PUBLIC_KEY as string;

    super({
      // O login entrega o token no cookie access_token; sem ler o cookie aqui,
      // toda rota autenticada responde 401 mesmo logo apos um login valido.
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: { cookies?: Record<string, string> }) =>
          request?.cookies?.access_token ?? null,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
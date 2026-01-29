import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8CQVGAD3TPyqvC+86DZfGEebvPsMCE/UCxABxjN7RWxg11iTfv+86GMyjMOHfODBUEH83UcZsdv6mIUWILP6reonf3/WIOqqm8xn2OvT+ZDd7x6m7CcO3ZSJciUtp1oU2Fj/WAjMdsSvUYZk6nZnxKWPxIc/+bzZTGeOqcq2Ok3xcihmwKckeYoTKQW8d4q3LbjL3WwC0o66t0SrLhfvDIWnjCvlCUy6Qh5zJy95dQo6+EzF6cVSJc9mWo5AywLt0phZ5KauaegQJs51Fn2oi8lkGt9jqj7U1+9EgQ6jQPSEmKucFfWWJEQ0KkyxVpZNBgVa4GprIdGEn8N9qwgTvQIDAQAB";

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
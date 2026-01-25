import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { EnvService } from "../env/env.service";
import z from "zod";

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
  system_role : z.enum(["ADMIN", "MEMBER"]),
  clinic_role : z.enum(["OWNER", "ADMIN", "PROFESSIONAL", "PATIENT"])
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>;


/**
 * Strategy para validar o token JWT e extrair os dados do payload
*/
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(env : EnvService) {
    const publicKey = env.get("JWT_PUBLIC_KEY");

    super({
      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey : Buffer.from(publicKey, "base64"),
      algorithms : ["RS256"],
    })
  }

  async validate(payload : UserPayload) {
    return tokenPayloadSchema.parse(payload);
  }
}
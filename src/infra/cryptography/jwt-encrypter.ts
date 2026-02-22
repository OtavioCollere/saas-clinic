import type { Encrypter } from "@/domain/application/cryptography/encrypter";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EnvService } from "../env/env.service";

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(
    @Inject(JwtService)
    private jwtService : JwtService
  ){}

  async sign(payload: Record<string, unknown>): Promise<string> {
    // Converte userId para sub (padrão JWT)
    const jwtPayload = payload.userId 
      ? { sub: payload.userId }
      : payload;
    
    return this.jwtService.signAsync(jwtPayload, 
    { expiresIn : '15m' }
    )
  }

  async refresh(payload: Record<string, unknown>): Promise<string> {
    // Converte userId para sub (padrão JWT)
    const jwtPayload = payload.userId 
      ? { sub: payload.userId }
      : payload;
    
    return this.jwtService.signAsync(jwtPayload, 
      { expiresIn : '7d' }
    )
  }
}
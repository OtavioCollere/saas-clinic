import type { Encrypter } from "@/domain/application/cryptography/encrypter";
import { Injectable } from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";
import type { EnvService } from "../env/env.service";

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(
    private jwtService : JwtService,
    private env : EnvService
  ){}

  async sign(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload, 
    { expiresIn : '15m' }
    )
  }

  async refresh(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload, 
      { expiresIn : '7d' }
    )
  }
}
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
    const { userId, ...rest } = payload;
    const jwtPayload = userId ? { sub: userId, ...rest } : payload;
    return this.jwtService.signAsync(jwtPayload, { expiresIn: '15m' });
  }

  async refresh(payload: Record<string, unknown>): Promise<string> {
    const { userId, ...rest } = payload;
    const jwtPayload = userId ? { sub: userId, ...rest } : payload;
    return this.jwtService.signAsync(jwtPayload, { expiresIn: '7d' });
  }
}
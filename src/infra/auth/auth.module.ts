import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'
import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'
import { JwtStrategy } from './jwt-strategy'
import { TotpMfaService } from './mfa/totp-mfa.service'
import { MfaService } from '@/domain/services/mfa-service'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory() {
        const privateKey = process.env.JWT_PRIVATE_KEY as string;
        const publicKey = process.env.JWT_PUBLIC_KEY as string;

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    EnvService,
    {
      provide: MfaService,
      useClass: TotpMfaService,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [MfaService],
})
export class AuthModule {}
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/prisma.service';
import { HealthController } from './controlers/health/health.controller';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [DatabaseModule, EmailModule, AuthModule, CryptographyModule],
  providers: [PrismaService],
  controllers: [HealthController],
})
export class HttpModule {}

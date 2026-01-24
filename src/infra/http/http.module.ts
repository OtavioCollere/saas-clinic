import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/prisma.service';
import { HealthController } from './controlers/health/health.controller';

@Module({
  imports: [DatabaseModule],
  providers: [PrismaService],
  controllers: [HealthController],
})
export class HttpModule {}

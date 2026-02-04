import { Controller, Get, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Public } from '@/infra/auth/public';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  latencyMs?: number;
  error?: string;
}

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: HealthStatus;
  };
}

@Public()
@Controller('/health')
export class HealthCheckController {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async check(): Promise<HealthCheckResult> {
    const dbHealth = await this.checkDatabaseHealth();

    return {
      status: this.determineOverallStatus(dbHealth),
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: dbHealth,
      },
    };
  }

  @Get('database')
  async checkDatabase(): Promise<HealthStatus> {
    const health = await this.checkDatabaseHealth();
    if (health.status === 'unhealthy') {
      throw new HttpException(health, HttpStatus.SERVICE_UNAVAILABLE);
    }
    return health;
  }

  @Get('ready')
  async ready() {
    const dbHealth = await this.checkDatabaseHealth();

    const isReady = dbHealth.status === 'healthy';

    if (!isReady) {
      throw new HttpException(
        {
          status: 'not_ready',
          timestamp: new Date().toISOString(),
          checks: { database: dbHealth },
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }

  private async checkDatabaseHealth(): Promise<HealthStatus> {
    const start = Date.now();
    try {
      if (!this.prisma) {
        return {
          status: 'unhealthy',
          latencyMs: Date.now() - start,
          error: 'Prisma client is not available',
        };
      }

      await (this.prisma as any).$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown database error',
      };
    }
  }

  private determineOverallStatus(db: HealthStatus): 'healthy' | 'degraded' | 'unhealthy' {
    if (db.status === 'healthy') return 'healthy';
    return 'unhealthy';
  }
}

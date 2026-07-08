import { Inject, Injectable } from "@nestjs/common";
import { TransactionManager } from "@/domain/application/transactions/transaction-manager";
import { PrismaService } from "./prisma.service";

@Injectable()
export class PrismaTransactionManager extends TransactionManager {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async run<T>(callback: (tx: any) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (prismaTx) => {
      return callback(prismaTx);
    });
  }
}

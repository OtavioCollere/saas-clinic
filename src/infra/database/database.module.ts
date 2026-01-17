import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    PrismaService,
    //{provide : UsersRepository, useClass : PrismaUsersRepository},
  ],
  exports: [
    PrismaService,
    // UsersRepository,
  ],
})
export class DatabaseModule {}

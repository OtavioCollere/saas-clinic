import { Module } from "@nestjs/common";
import { SendgridEmailService } from "./sendgrid-email.service";
import { EnvModule } from "../env/env.module";
import { EmailService } from "@/core/services/email.service";

@Module({
  imports: [EnvModule],
  providers: [
    {provide : EmailService, useClass : SendgridEmailService},
  ],
  exports: [SendgridEmailService],
})
export class EmailModule {}
import { SendEmailVerificationUseCase } from "@/domain/application/use-cases/email-verification/send-email-verification";
import { BadRequestException, Body, Controller, Inject, NotFoundException, Post, UsePipes } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { User } from "@prisma/client";
import { isLeft, unwrapEither } from "@/core/either/either";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { Public } from "@/infra/auth/public";

@Public()
@Controller("/email-verification")
export class SendEmailVerificationController {

  constructor(
    @Inject(SendEmailVerificationUseCase)
    private readonly sendEmailVerificationUseCase: SendEmailVerificationUseCase
  ) {}

  @Post("/send-email-verification")
  async handle() {

    const userId = '5bfb0d97-c4f5-4b49-9a90-ef2174240f50';

    const result = await this.sendEmailVerificationUseCase.execute({ userId });
    if(isLeft(result)) {
      const error = unwrapEither(result);

      switch(error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { message } = unwrapEither(result);

    return {
      message
    }
  }
}
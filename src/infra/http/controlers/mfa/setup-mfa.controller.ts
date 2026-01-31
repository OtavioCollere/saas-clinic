import { isLeft, unwrapEither } from "@/shared/either/either";
import { MfaAlreadyExistsError } from "@/shared/errors/mfa-already-exists-error";
import { SetupMfaUseCase } from "@/domain/application/use-cases/mfa/setup-mfa";
import { User } from "@/domain/enterprise/entities/user";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { BadRequestException, Controller, Post } from "@nestjs/common";

@Controller("/mfa")
export class SetupMfaController{
  constructor(private setupMfaUseCase: SetupMfaUseCase){}
  
  @Post("/setup")
  async handle(@CurrentUser() user: User){

    const result = await this.setupMfaUseCase.execute({ userId: user.id.toString() });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case MfaAlreadyExistsError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { backupCodes } = unwrapEither(result);

    return {
      backupCodes
    };
  }
}
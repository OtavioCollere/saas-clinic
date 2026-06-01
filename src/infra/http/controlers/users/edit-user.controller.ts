import { isLeft, unwrapEither } from "@/shared/either/either";
import { EditUserUseCase } from "@/domain/application/use-cases/users/edit-user";
import {
  Body,
  Controller,
  HttpCode,
  Inject,
  NotFoundException,
  Patch,
  Req,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import type { FastifyRequest } from "fastify";
import type { UserPayload } from "@/infra/auth/jwt-strategy";

interface AuthenticatedRequest extends FastifyRequest {
  user?: UserPayload;
}

const editUserBodySchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
}).refine((data) => data.name || data.email, {
  message: "Informe ao menos um campo para atualizar.",
});

type EditUserBodySchema = z.infer<typeof editUserBodySchema>;
const editUserBodyPipe = new ZodValidationPipe(editUserBodySchema);

@ApiTags("Users")
@Controller("/users")
export class EditUserController {
  constructor(
    @Inject(EditUserUseCase)
    private readonly editUserUseCase: EditUserUseCase,
  ) {}

  @Patch("/me")
  @HttpCode(200)
  @ApiOperation({ summary: "Edit current user name/email" })
  @ApiOkResponse({ description: "User updated successfully" })
  @ApiUnauthorizedResponse({ description: "Invalid or missing token" })
  async handle(
    @Req() request: AuthenticatedRequest,
    @Body(editUserBodyPipe) body: EditUserBodySchema,
  ) {
    const userId = request.user?.sub;

    if (!userId) {
      throw new NotFoundException("User not found");
    }

    const result = await this.editUserUseCase.execute({
      userId,
      name: body.name,
      email: body.email,
    });

    if (isLeft(result)) {
      throw new NotFoundException(unwrapEither(result).message);
    }

    const { user } = unwrapEither(result);
    return { name: user.name, email: user.email.getValue() };
  }
}

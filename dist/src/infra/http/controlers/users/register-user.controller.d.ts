import type { RegisterUserUseCase } from "@/domain/application/use-cases/users/register-user";
import { BadRequestException } from "@nestjs/common";
import z from "zod";
declare const registerUserBodySchema: z.ZodObject<{
    name: z.ZodString;
    cpf: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>;
export declare class RegisterUserController {
    private registerUser;
    constructor(registerUser: RegisterUserUseCase);
    handle(body: RegisterUserBodySchema): Promise<BadRequestException | {
        id: string;
        name: string;
        cpf: string;
        email: string;
        role: import("../../../../domain/enterprise/value-objects/user-role").UserRoleType;
        createdAt: string;
        updatedAt: string | undefined;
    }>;
}
export {};

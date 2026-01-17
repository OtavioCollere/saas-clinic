import type { RegisterUserUseCase } from "@/domain/application/use-cases/users/register-user";
export declare class RegisterUserController {
    private registerUser;
    constructor(registerUser: RegisterUserUseCase);
    handle(): Promise<void>;
}

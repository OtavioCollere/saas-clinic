import { Injectable } from "@nestjs/common";
import { Either, makeLeft, makeRight } from "@/shared/either/either";
import { UserNotFoundError } from "@/shared/errors/user-not-found-error";
import { UsersRepository } from "../../repositories/users-repository";
import { SessionsRepository } from "../../repositories/sessions-repository";

interface LogoutUseCaseRequest {
    userId: string;
}

type LogoutUseCaseResponse = Either<UserNotFoundError, void>;

@Injectable()
export class LogoutUseCase {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly sessionsRepository: SessionsRepository,
    ) {}

    async execute({ userId }: LogoutUseCaseRequest): Promise<LogoutUseCaseResponse> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            return makeLeft(new UserNotFoundError());
        }

        const sessions = await this.sessionsRepository.findByUserId(userId);

        for (const session of sessions) {
            session.revokeSession();
            await this.sessionsRepository.update(session);
        }

        return makeRight(undefined);
    }
}
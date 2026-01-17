import { type Either, makeLeft, makeRight } from "@/core/either/either";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists-error";
import { User } from "@/domain/enterprise/entities/user";
import { Cpf } from "@/domain/enterprise/value-objects/cpf";
import { Email } from "@/domain/enterprise/value-objects/email";
import { UserRole } from "@/domain/enterprise/value-objects/user-role";
import type { HashGenerator } from "../../cryptography/hash-generator";
import type { UsersRepository } from "../../repositories/users-repository";

interface RegisterUserUseCaseRequest {
	name: string;
	cpf: string;
	email: string;
	password: string;
}

type RegisterUserUseCaseResponse = Either<
	EmailAlreadyExistsError,
	{
		user: User;
	}
>;

export class RegisterUserUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		name,
		cpf,
		email,
		password,
	}: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
		const emailExists = await this.usersRepository.findByEmail(email);

		if (emailExists) {
			return makeLeft(new EmailAlreadyExistsError());
		}

		const passwordHash = this.hashGenerator.hash(password);

		const cpfVO = Cpf.create(cpf);
		const emailVO = Email.create(email);

		const user = User.create({
			name,
			cpf: cpfVO,
			email: emailVO,
			password: passwordHash,
			role: UserRole.member(),
		});

		return makeRight({
			user,
		});
	}
}

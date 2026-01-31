import { Inject, Injectable } from "@nestjs/common";
import { Either, makeLeft, makeRight } from "@/core/either/either";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists-error";
import { User } from "@/domain/enterprise/entities/user";
import { Cpf } from "@/domain/enterprise/value-objects/cpf";
import { Email } from "@/domain/enterprise/value-objects/email";
import { UserRole } from "@/domain/enterprise/value-objects/user-role";
import { HashGenerator } from "../../cryptography/hash-generator";
import { UsersRepository } from "../../repositories/users-repository";
import { InvalidCpfError } from "@/core/errors/invalid-cpf-error";
import { InvalidEmailError } from "@/core/errors/invalid-email-error";
import { CpfAlreadyExistsError } from "@/core/errors/cpf-already-exists-error";

interface RegisterUserUseCaseRequest {
	name: string;
	cpf: string;
	email: string;
	password: string;
}

type RegisterUserUseCaseResponse = Either<
	EmailAlreadyExistsError | InvalidCpfError | InvalidEmailError | CpfAlreadyExistsError,
	{
		user: User;
	}
>;

@Injectable()
export class RegisterUserUseCase {
	constructor(
		@Inject(UsersRepository)
		private usersRepository: UsersRepository,
		@Inject(HashGenerator)
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

		const passwordHash = await this.hashGenerator.hash(password);

		const cpfExists = await this.usersRepository.findByCpf(cpf); 
		if (cpfExists) {
			return makeLeft(new CpfAlreadyExistsError());
		}

		const isValidCpf = Cpf.isValid(cpf);
		if (!isValidCpf) {
			return makeLeft(new InvalidCpfError());
		}

		const isValidEmail = Email.isValid(email);
		if (!isValidEmail) {
			return makeLeft(new InvalidEmailError());
		}

		const cpfVO = Cpf.create(cpf);
		const emailVO = Email.create(email);

		const user = User.create({
			name,
			cpf: cpfVO,
			email: emailVO,
			password: passwordHash,
			role: UserRole.member(),
		});

		await this.usersRepository.create(user);

		return makeRight({
			user,
		});
	}
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const email_already_exists_error_1 = require("../../../../core/errors/email-already-exists-error");
const user_1 = require("../../../enterprise/entities/user");
const cpf_1 = require("../../../enterprise/value-objects/cpf");
const email_1 = require("../../../enterprise/value-objects/email");
const user_role_1 = require("../../../enterprise/value-objects/user-role");
class RegisterUserUseCase {
    constructor(usersRepository, hashGenerator) {
        this.usersRepository = usersRepository;
        this.hashGenerator = hashGenerator;
    }
    async execute({ name, cpf, email, password, }) {
        const emailExists = await this.usersRepository.findByEmail(email);
        if (emailExists) {
            return (0, either_1.makeLeft)(new email_already_exists_error_1.EmailAlreadyExistsError());
        }
        const passwordHash = this.hashGenerator.hash(password);
        const cpfVO = cpf_1.Cpf.create(cpf);
        const emailVO = email_1.Email.create(email);
        const user = user_1.User.create({
            name,
            cpf: cpfVO,
            email: emailVO,
            password: passwordHash,
            role: user_role_1.UserRole.member(),
        });
        return (0, either_1.makeRight)({
            user,
        });
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
//# sourceMappingURL=register-user.js.map
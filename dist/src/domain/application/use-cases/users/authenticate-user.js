"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUserUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const wrong_credentials_error_1 = require("../../../../core/errors/wrong-credentials-error");
class AuthenticateUserUseCase {
    constructor(usersRepository, hashComparer, encrypter) {
        this.usersRepository = usersRepository;
        this.hashComparer = hashComparer;
        this.encrypter = encrypter;
    }
    async execute({ email, password }) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            return (0, either_1.makeLeft)(new wrong_credentials_error_1.WrongCredentialsError());
        }
        const doesPasswordMatches = await this.hashComparer.compare(password, user.password);
        if (!doesPasswordMatches) {
            return (0, either_1.makeLeft)(new wrong_credentials_error_1.WrongCredentialsError());
        }
        const accessToken = await this.encrypter.sign(user.id.toString());
        const refreshToken = await this.encrypter.refresh(user.id.toString());
        return (0, either_1.makeRight)({
            access_token: accessToken,
            refresh_token: refreshToken
        });
    }
}
exports.AuthenticateUserUseCase = AuthenticateUserUseCase;
//# sourceMappingURL=authenticate-user.js.map
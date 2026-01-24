"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserController = void 0;
const either_1 = require("../../../../core/either/either");
const email_already_exists_error_1 = require("../../../../core/errors/email-already-exists-error");
const common_1 = require("@nestjs/common");
const zod_1 = __importDefault(require("zod"));
const zod_validation_pipe_1 = require("../../pipes/zod-validation-pipe");
const user_presenter_1 = require("../../presenters/user-presenter");
const registerUserBodySchema = zod_1.default.object({
    name: zod_1.default.string(),
    cpf: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
});
const registerUserValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(registerUserBodySchema);
let RegisterUserController = class RegisterUserController {
    constructor(registerUser) {
        this.registerUser = registerUser;
    }
    async handle(body) {
        const { name, cpf, email, password } = body;
        const result = await this.registerUser.execute({ name, cpf, email, password });
        if ((0, either_1.isLeft)(result)) {
            const error = (0, either_1.unwrapEither)(result);
            switch (error.constructor) {
                case email_already_exists_error_1.EmailAlreadyExistsError:
                    return new common_1.BadRequestException(error.message);
                default:
                    return new common_1.BadRequestException(error.message);
            }
        }
        const { user } = (0, either_1.unwrapEither)(result);
        return user_presenter_1.UserPresenter.toHTTP(user);
    }
};
exports.RegisterUserController = RegisterUserController;
__decorate([
    (0, common_1.Post)("/register-user"),
    (0, common_1.UsePipes)(registerUserValidationPipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegisterUserController.prototype, "handle", null);
exports.RegisterUserController = RegisterUserController = __decorate([
    (0, common_1.Controller)("/users"),
    __metadata("design:paramtypes", [Function])
], RegisterUserController);
//# sourceMappingURL=register-user.controller.js.map
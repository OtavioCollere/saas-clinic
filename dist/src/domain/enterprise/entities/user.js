"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const entity_1 = require("../../../core/entities/entity");
class User extends entity_1.Entity {
    static create(props, id) {
        const user = new User({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return user;
    }
    get name() {
        return this.props.name;
    }
    get cpf() {
        return this.props.cpf;
    }
    get email() {
        return this.props.email;
    }
    get password() {
        return this.props.password;
    }
    get role() {
        return this.props.role;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    set name(name) {
        this.props.name = name;
    }
    set cpf(cpf) {
        this.props.cpf = cpf;
    }
    set email(email) {
        this.props.email = email;
    }
    set password(password) {
        this.props.password = password;
    }
    set role(role) {
        this.props.role = role;
    }
    set updatedAt(updatedAt) {
        this.props.updatedAt = updatedAt;
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map
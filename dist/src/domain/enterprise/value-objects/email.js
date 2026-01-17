"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const domain_error_1 = require("../../../core/errors/domain-error");
class Email {
    constructor(value) {
        this.value = value;
    }
    static create(rawEmail) {
        const normalized = Email.normalize(rawEmail);
        if (!Email.isValid(normalized)) {
            throw new domain_error_1.DomainError('Invalid email address');
        }
        return new Email(normalized);
    }
    getValue() {
        return this.value;
    }
    equals(email) {
        return this.value === email.value;
    }
    static normalize(email) {
        return email.trim().toLowerCase();
    }
    static isValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
exports.Email = Email;
//# sourceMappingURL=email.js.map
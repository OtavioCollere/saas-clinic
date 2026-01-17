"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cpf = void 0;
const domain_error_1 = require("../../../core/errors/domain-error");
class Cpf {
    constructor(value) {
        this.value = value;
    }
    static create(rawCpf) {
        const normalized = Cpf.normalize(rawCpf);
        if (!Cpf.isValid(normalized)) {
            throw new domain_error_1.DomainError('Invalid CPF');
        }
        return new Cpf(normalized);
    }
    getValue() {
        return this.value;
    }
    equals(cpf) {
        return this.value === cpf.value;
    }
    static normalize(cpf) {
        return cpf.replace(/\D/g, '');
    }
    static isValid(cpf) {
        if (cpf.length !== 11)
            return false;
        if (/^(\d)\1+$/.test(cpf))
            return false;
        const digits = cpf.split('').map(Number);
        const calcDigit = (base) => {
            const sum = base.reduce((acc, digit, index) => acc + digit * (base.length + 1 - index), 0);
            const mod = (sum * 10) % 11;
            return mod === 10 ? 0 : mod;
        };
        const firstCheck = calcDigit(digits.slice(0, 9));
        const secondCheck = calcDigit(digits.slice(0, 10));
        return firstCheck === digits[9] && secondCheck === digits[10];
    }
}
exports.Cpf = Cpf;
//# sourceMappingURL=cpf.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profession = void 0;
class Profession {
    constructor(value) {
        this.value = value;
    }
    static medico() {
        return new Profession('MEDICO');
    }
    static biomedico() {
        return new Profession('BIOMEDICO');
    }
    isMedico() {
        return this.value === 'MEDICO';
    }
    isBiomedico() {
        return this.value === 'BIOMEDICO';
    }
    getValue() {
        return this.value;
    }
}
exports.Profession = Profession;
//# sourceMappingURL=profession.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patient = void 0;
const entity_1 = require("../../../core/entities/entity");
class Patient extends entity_1.Entity {
    static create(props, id) {
        const patient = new Patient({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return patient;
    }
    get clinicId() {
        return this.props.clinicId;
    }
    get userId() {
        return this.props.userId;
    }
    get anamnesis() {
        return this.props.anamnesis;
    }
    get name() {
        return this.props.name;
    }
    get birthDay() {
        return this.props.birthDay;
    }
    get address() {
        return this.props.address;
    }
    get zipCode() {
        return this.props.zipCode;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    set clinicId(clinicId) {
        this.props.clinicId = clinicId;
    }
    set userId(userId) {
        this.props.userId = userId;
    }
    set anamnesis(anamnesis) {
        this.props.anamnesis = anamnesis;
    }
    set name(name) {
        this.props.name = name;
    }
    set birthDay(birthDay) {
        this.props.birthDay = birthDay;
    }
    set address(address) {
        this.props.address = address;
    }
    set zipCode(zipCode) {
        this.props.zipCode = zipCode;
    }
    set updatedAt(updatedAt) {
        this.props.updatedAt = updatedAt;
    }
}
exports.Patient = Patient;
//# sourceMappingURL=patient.js.map
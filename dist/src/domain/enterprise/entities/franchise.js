"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Franchise = void 0;
const entity_1 = require("../../../core/entities/entity");
class Franchise extends entity_1.Entity {
    static create(props, id) {
        const franchise = new Franchise({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return franchise;
    }
    get clinicId() {
        return this.props.clinicId;
    }
    get name() {
        return this.props.name;
    }
    get address() {
        return this.props.address;
    }
    get zipCode() {
        return this.props.zipCode;
    }
    get status() {
        return this.props.status;
    }
    get description() {
        return this.props.description;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    set clinicId(clinicId) {
        this.props.clinicId = clinicId;
    }
    set name(name) {
        this.props.name = name;
    }
    set address(address) {
        this.props.address = address;
    }
    set zipCode(zipCode) {
        this.props.zipCode = zipCode;
    }
    set status(status) {
        this.props.status = status;
    }
    set description(description) {
        this.props.description = description;
    }
    set updatedAt(updatedAt) {
        this.props.updatedAt = updatedAt;
    }
}
exports.Franchise = Franchise;
//# sourceMappingURL=franchise.js.map
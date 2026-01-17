"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicMembership = void 0;
const entity_1 = require("../../../core/entities/entity");
class ClinicMembership extends entity_1.Entity {
    static create(props, id) {
        const membership = new ClinicMembership({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return membership;
    }
    get userId() {
        return this.props.userId;
    }
    get clinicId() {
        return this.props.clinicId;
    }
    get role() {
        return this.props.role;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    set userId(userId) {
        this.props.userId = userId;
    }
    set clinicId(clinicId) {
        this.props.clinicId = clinicId;
    }
    set role(role) {
        this.props.role = role;
    }
    set updatedAt(updatedAt) {
        this.props.updatedAt = updatedAt;
    }
}
exports.ClinicMembership = ClinicMembership;
//# sourceMappingURL=clinic-membership.js.map
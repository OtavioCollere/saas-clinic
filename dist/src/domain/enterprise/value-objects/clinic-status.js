"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicStatus = void 0;
const domain_error_1 = require("../../../core/errors/domain-error");
class ClinicStatus {
    constructor(value) {
        this.value = value;
    }
    static active() {
        return new ClinicStatus('ACTIVE');
    }
    static inactive() {
        return new ClinicStatus('INACTIVE');
    }
    isActive() {
        return this.value === 'ACTIVE';
    }
    isInactive() {
        return this.value === 'INACTIVE';
    }
    getValue() {
        return this.value;
    }
    activate() {
        if (this.isActive()) {
            throw new domain_error_1.DomainError('Clinic is already active');
        }
        return ClinicStatus.active();
    }
    inactivate() {
        if (this.isInactive()) {
            throw new domain_error_1.DomainError('Clinic is already inactive');
        }
        return ClinicStatus.inactive();
    }
}
exports.ClinicStatus = ClinicStatus;
//# sourceMappingURL=clinic-status.js.map
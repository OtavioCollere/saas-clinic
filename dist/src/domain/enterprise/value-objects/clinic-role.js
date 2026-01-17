"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicRole = void 0;
class ClinicRole {
    constructor(value) {
        this.value = value;
    }
    static owner() {
        return new ClinicRole('OWNER');
    }
    static admin() {
        return new ClinicRole('ADMIN');
    }
    static professional() {
        return new ClinicRole('PROFESSIONAL');
    }
    static patient() {
        return new ClinicRole('PATIENT');
    }
    isOwner() {
        return this.value === 'OWNER';
    }
    isAdmin() {
        return this.value === 'ADMIN';
    }
    isProfessional() {
        return this.value === 'PROFESSIONAL';
    }
    isPatient() {
        return this.value === 'PATIENT';
    }
    getValue() {
        return this.value;
    }
}
exports.ClinicRole = ClinicRole;
//# sourceMappingURL=clinic-role.js.map
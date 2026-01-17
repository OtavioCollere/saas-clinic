"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FranchiseStatus = void 0;
const domain_error_1 = require("../../../core/errors/domain-error");
class FranchiseStatus {
    constructor(value) {
        this.value = value;
    }
    static active() {
        return new FranchiseStatus('ACTIVE');
    }
    static inactive() {
        return new FranchiseStatus('INACTIVE');
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
            throw new domain_error_1.DomainError('Franchise is already active');
        }
        return FranchiseStatus.active();
    }
    inactivate() {
        if (this.isInactive()) {
            throw new domain_error_1.DomainError('Franchise is already inactive');
        }
        return FranchiseStatus.inactive();
    }
}
exports.FranchiseStatus = FranchiseStatus;
//# sourceMappingURL=franchise-status.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcedureStatus = void 0;
class ProcedureStatus {
    constructor(value) {
        this.value = value;
    }
    static active() {
        return new ProcedureStatus('ACTIVE');
    }
    static inactive() {
        return new ProcedureStatus('INACTIVE');
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
}
exports.ProcedureStatus = ProcedureStatus;
//# sourceMappingURL=procedure-status.js.map
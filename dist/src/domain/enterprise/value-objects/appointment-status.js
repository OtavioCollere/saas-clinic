"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentStatus = void 0;
const domain_error_1 = require("../../../core/errors/domain-error");
class AppointmentStatus {
    constructor(value) {
        this.value = value;
    }
    static waiting() {
        return new AppointmentStatus('WAITING');
    }
    static confirmed() {
        return new AppointmentStatus('CONFIRMED');
    }
    static done() {
        return new AppointmentStatus('DONE');
    }
    static canceled() {
        return new AppointmentStatus('CANCELED');
    }
    isWaiting() {
        return this.value === 'WAITING';
    }
    isConfirmed() {
        return this.value === 'CONFIRMED';
    }
    isDone() {
        return this.value === 'DONE';
    }
    isCanceled() {
        return this.value === 'CANCELED';
    }
    getValue() {
        return this.value;
    }
    confirm() {
        if (!this.isWaiting()) {
            throw new domain_error_1.DomainError('Only waiting appointments can be confirmed');
        }
        return AppointmentStatus.confirmed();
    }
    cancel() {
        if (this.isDone()) {
            throw new domain_error_1.DomainError('Done appointments cannot be canceled');
        }
        if (this.isCanceled()) {
            throw new domain_error_1.DomainError('Appointment is already canceled');
        }
        return AppointmentStatus.canceled();
    }
    finish() {
        if (!this.isConfirmed()) {
            throw new domain_error_1.DomainError('Only confirmed appointments can be finished');
        }
        return AppointmentStatus.done();
    }
}
exports.AppointmentStatus = AppointmentStatus;
//# sourceMappingURL=appointment-status.js.map
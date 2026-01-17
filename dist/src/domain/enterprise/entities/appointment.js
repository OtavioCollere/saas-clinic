"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const entity_1 = require("../../../core/entities/entity");
class Appointment extends entity_1.Entity {
    static create(props, id) {
        const appointment = new Appointment({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return appointment;
    }
    get professionalId() {
        return this.props.professionalId;
    }
    get franchiseId() {
        return this.props.franchiseId;
    }
    get patientId() {
        return this.props.patientId;
    }
    get name() {
        return this.props.name;
    }
    get appointmentItems() {
        return this.props.appointmentItems;
    }
    get startAt() {
        return this.props.startAt;
    }
    get endAt() {
        return this.props.endAt;
    }
    get status() {
        return this.props.status;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    set professionalId(professionalId) {
        this.props.professionalId = professionalId;
    }
    set franchiseId(franchiseId) {
        this.props.franchiseId = franchiseId;
    }
    set patientId(patientId) {
        this.props.patientId = patientId;
    }
    set name(name) {
        this.props.name = name;
    }
    set appointmentItems(appointmentItems) {
        this.props.appointmentItems = appointmentItems;
    }
    set startAt(startAt) {
        this.props.startAt = startAt;
    }
    set endAt(endAt) {
        this.props.endAt = endAt;
    }
    set status(status) {
        this.props.status = status;
    }
    set updatedAt(updatedAt) {
        this.props.updatedAt = updatedAt;
    }
}
exports.Appointment = Appointment;
//# sourceMappingURL=appointment.js.map
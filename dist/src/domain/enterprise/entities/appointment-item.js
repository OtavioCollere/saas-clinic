"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentItem = void 0;
const entity_1 = require("../../../core/entities/entity");
class AppointmentItem extends entity_1.Entity {
    static create(props, id) {
        const appointmentItem = new AppointmentItem(props, id);
        return appointmentItem;
    }
    get appointmentId() {
        return this.props.appointmentId;
    }
    get procedureId() {
        return this.props.procedureId;
    }
    get price() {
        return this.props.price;
    }
    get notes() {
        return this.props.notes;
    }
    set appointmentId(appointmentId) {
        this.props.appointmentId = appointmentId;
    }
    set procedureId(procedureId) {
        this.props.procedureId = procedureId;
    }
    set price(price) {
        this.props.price = price;
    }
    set notes(notes) {
        this.props.notes = notes;
    }
}
exports.AppointmentItem = AppointmentItem;
//# sourceMappingURL=appointment-item.js.map
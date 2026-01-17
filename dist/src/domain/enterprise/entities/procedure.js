"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Procedure = void 0;
const entity_1 = require("../../../core/entities/entity");
class Procedure extends entity_1.Entity {
    static create(props, id) {
        const procedure = new Procedure({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return procedure;
    }
    get franchiseId() {
        return this.props.franchiseId;
    }
    get name() {
        return this.props.name;
    }
    get price() {
        return this.props.price;
    }
    get notes() {
        return this.props.notes;
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
    set franchiseId(franchiseId) {
        this.props.franchiseId = franchiseId;
    }
    set name(name) {
        this.props.name = name;
    }
    set price(price) {
        this.props.price = price;
    }
    set notes(notes) {
        this.props.notes = notes;
    }
    set status(status) {
        this.props.status = status;
    }
    set updatedAt(updatedAt) {
        this.props.updatedAt = updatedAt;
    }
}
exports.Procedure = Procedure;
//# sourceMappingURL=procedure.js.map
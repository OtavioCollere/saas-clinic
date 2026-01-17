"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clinic = void 0;
const entity_1 = require("../../../core/entities/entity");
const clinic_status_1 = require("../value-objects/clinic-status");
const slug_1 = require("../value-objects/slug");
class Clinic extends entity_1.Entity {
    static create(props, id) {
        const slug = props.slug ?? slug_1.Slug.create(props.name);
        const clinic = new Clinic({
            ...props,
            slug,
            createdAt: props.createdAt ?? new Date(),
            status: props.status ?? clinic_status_1.ClinicStatus.active(),
        }, id);
        return clinic;
    }
    get name() {
        return this.props.name;
    }
    get slug() {
        return this.props.slug;
    }
    get description() {
        return this.props.description;
    }
    get avatarUrl() {
        return this.props.avatarUrl;
    }
    get ownerId() {
        return this.props.ownerId;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get status() {
        return this.props.status;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    set name(name) {
        this.props.name = name;
    }
    set slug(slug) {
        this.props.slug = slug;
    }
    set description(description) {
        this.props.description = description;
    }
    set avatarUrl(avatarUrl) {
        this.props.avatarUrl = avatarUrl;
    }
    set ownerId(ownerId) {
        this.props.ownerId = ownerId;
    }
    set status(status) {
        this.props.status = status;
    }
    set updatedAt(updatedAt) {
        this.props.updatedAt = updatedAt;
    }
}
exports.Clinic = Clinic;
//# sourceMappingURL=clinic.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Professional = void 0;
const entity_1 = require("../../../core/entities/entity");
class Professional extends entity_1.Entity {
    static create(props, id) {
        const professional = new Professional({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return professional;
    }
    get franchiseId() {
        return this.props.franchiseId;
    }
    get userId() {
        return this.props.userId;
    }
    get council() {
        return this.props.council;
    }
    get councilNumber() {
        return this.props.councilNumber;
    }
    get councilState() {
        return this.props.councilState;
    }
    get profession() {
        return this.props.profession;
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
    set userId(userId) {
        this.props.userId = userId;
    }
    set council(council) {
        this.props.council = council;
    }
    set councilNumber(councilNumber) {
        this.props.councilNumber = councilNumber;
    }
    set councilState(councilState) {
        this.props.councilState = councilState;
    }
    set profession(profession) {
        this.props.profession = profession;
    }
    set updatedAt(updatedAt) {
        this.props.updatedAt = updatedAt;
    }
}
exports.Professional = Professional;
//# sourceMappingURL=professional.js.map
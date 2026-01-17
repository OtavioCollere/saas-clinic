"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Anamnesis = void 0;
const entity_1 = require("../../../../core/entities/entity");
class Anamnesis extends entity_1.Entity {
    static create(props, id) {
        const anamnesis = new Anamnesis({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return anamnesis;
    }
    get patientId() {
        return this.props.patientId;
    }
    get aestheticHistory() {
        return this.props.aestheticHistory;
    }
    get healthConditions() {
        return this.props.healthConditions;
    }
    get medicalHistory() {
        return this.props.medicalHistory;
    }
    get physicalAssessment() {
        return this.props.physicalAssessment;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    set patientId(patientId) {
        this.props.patientId = patientId;
    }
    set aestheticHistory(aestheticHistory) {
        this.props.aestheticHistory = aestheticHistory;
    }
    set healthConditions(healthConditions) {
        this.props.healthConditions = healthConditions;
    }
    set medicalHistory(medicalHistory) {
        this.props.medicalHistory = medicalHistory;
    }
    set physicalAssessment(physicalAssessment) {
        this.props.physicalAssessment = physicalAssessment;
    }
    set updatedAt(updatedAt) {
        this.props.updatedAt = updatedAt;
    }
}
exports.Anamnesis = Anamnesis;
//# sourceMappingURL=anamnesis.js.map
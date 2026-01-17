"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditClinicUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const clinic_already_exists_error_1 = require("../../../../core/errors/clinic-already-exists-error");
const clinic_not_found_error_1 = require("../../../../core/errors/clinic-not-found-error");
const user_is_not_owner_error_1 = require("../../../../core/errors/user-is-not-owner-error");
const slug_1 = require("../../../enterprise/value-objects/slug");
class EditClinicUseCase {
    constructor(clinicRepository, clinicMembershipRepository) {
        this.clinicRepository = clinicRepository;
        this.clinicMembershipRepository = clinicMembershipRepository;
    }
    async execute({ clinicId, editorId, name, description, avatarUrl, }) {
        const clinic = await this.clinicRepository.findById(clinicId);
        if (!clinic) {
            return (0, either_1.makeLeft)(new clinic_not_found_error_1.ClinicNotFoundError());
        }
        const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(editorId, clinicId);
        if (!clinicMembership || !clinicMembership.role.isOwner()) {
            return (0, either_1.makeLeft)(new user_is_not_owner_error_1.UserIsNotOwnerError());
        }
        if (name) {
            const slug = slug_1.Slug.create(name);
            const existingClinic = await this.clinicRepository.findBySlug(slug.getValue());
            if (existingClinic && existingClinic.id !== clinic.id) {
                return (0, either_1.makeLeft)(new clinic_already_exists_error_1.ClinicAlreadyExistsError());
            }
            clinic.name = name;
            clinic.slug = slug;
        }
        if (description)
            clinic.description = description;
        if (avatarUrl)
            clinic.avatarUrl = avatarUrl;
        clinic.updatedAt = new Date();
        await this.clinicRepository.update(clinic);
        return (0, either_1.makeRight)({ clinic });
    }
}
exports.EditClinicUseCase = EditClinicUseCase;
//# sourceMappingURL=edit-clinic.js.map
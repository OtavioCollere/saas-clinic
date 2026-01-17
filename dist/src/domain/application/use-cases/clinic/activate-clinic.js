"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivateClinicUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const clinic_not_found_error_1 = require("../../../../core/errors/clinic-not-found-error");
const user_is_not_owner_error_1 = require("../../../../core/errors/user-is-not-owner-error");
class ActivateClinicUseCase {
    constructor(clinicRepository, clinicMembershipRepository) {
        this.clinicRepository = clinicRepository;
        this.clinicMembershipRepository = clinicMembershipRepository;
    }
    async execute({ clinicId, userId, }) {
        const clinic = await this.clinicRepository.findById(clinicId);
        if (!clinic) {
            return (0, either_1.makeLeft)(new clinic_not_found_error_1.ClinicNotFoundError());
        }
        const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(userId, clinicId);
        if (!clinicMembership || !clinicMembership.role.isOwner()) {
            return (0, either_1.makeLeft)(new user_is_not_owner_error_1.UserIsNotOwnerError());
        }
        clinic.status = clinic.status.activate();
        clinic.updatedAt = new Date();
        await this.clinicRepository.update(clinic);
        return (0, either_1.makeRight)({ clinic });
    }
}
exports.ActivateClinicUseCase = ActivateClinicUseCase;
//# sourceMappingURL=activate-clinic.js.map
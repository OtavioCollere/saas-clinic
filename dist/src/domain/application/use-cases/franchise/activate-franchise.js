"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivateFranchiseUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const franchise_has_pending_appointments_error_1 = require("../../../../core/errors/franchise-has-pending-appointments-error");
const franchise_not_found_error_1 = require("../../../../core/errors/franchise-not-found-error");
const user_is_not_owner_error_1 = require("../../../../core/errors/user-is-not-owner-error");
class ActivateFranchiseUseCase {
    constructor(franchiseRepository, appointmentsRepository, clinicMembershipRepository) {
        this.franchiseRepository = franchiseRepository;
        this.appointmentsRepository = appointmentsRepository;
        this.clinicMembershipRepository = clinicMembershipRepository;
    }
    async execute({ franchiseId, userId, }) {
        const franchise = await this.franchiseRepository.findById(franchiseId);
        if (!franchise) {
            return (0, either_1.makeLeft)(new franchise_not_found_error_1.FranchiseNotFoundError());
        }
        const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(userId, franchise.clinicId.toString());
        if (!clinicMembership || !clinicMembership.role.isOwner()) {
            return (0, either_1.makeLeft)(new user_is_not_owner_error_1.UserIsNotOwnerError());
        }
        const pendingAppointments = await this.appointmentsRepository.findPendingByFranchiseId(franchiseId);
        if (pendingAppointments.length > 0) {
            return (0, either_1.makeLeft)(new franchise_has_pending_appointments_error_1.FranchiseHasPendingAppointmentsError());
        }
        franchise.status = franchise.status.activate();
        franchise.updatedAt = new Date();
        await this.franchiseRepository.update(franchise);
        return (0, either_1.makeRight)({ franchise });
    }
}
exports.ActivateFranchiseUseCase = ActivateFranchiseUseCase;
//# sourceMappingURL=activate-franchise.js.map
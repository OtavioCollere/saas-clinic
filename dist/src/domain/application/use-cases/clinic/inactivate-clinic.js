"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InactivateClinicUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const clinic_has_pending_appointments_error_1 = require("../../../../core/errors/clinic-has-pending-appointments-error");
const clinic_not_found_error_1 = require("../../../../core/errors/clinic-not-found-error");
const user_is_not_owner_error_1 = require("../../../../core/errors/user-is-not-owner-error");
class InactivateClinicUseCase {
    constructor(clinicRepository, appointmentsRepository, clinicMembershipRepository) {
        this.clinicRepository = clinicRepository;
        this.appointmentsRepository = appointmentsRepository;
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
        const pendingAppointments = await this.appointmentsRepository.findPendingByClinicId(clinicId);
        if (pendingAppointments.length > 0) {
            return (0, either_1.makeLeft)(new clinic_has_pending_appointments_error_1.ClinicHasPendingAppointmentsError());
        }
        clinic.status = clinic.status.inactivate();
        clinic.updatedAt = new Date();
        await this.clinicRepository.update(clinic);
        return (0, either_1.makeRight)({ clinic });
    }
}
exports.InactivateClinicUseCase = InactivateClinicUseCase;
//# sourceMappingURL=inactivate-clinic.js.map
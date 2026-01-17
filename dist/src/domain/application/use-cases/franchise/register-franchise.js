"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFranchiseUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const clinic_not_found_error_1 = require("../../../../core/errors/clinic-not-found-error");
const user_is_not_owner_error_1 = require("../../../../core/errors/user-is-not-owner-error");
const franchise_1 = require("../../../enterprise/entities/franchise");
const franchise_status_1 = require("../../../enterprise/value-objects/franchise-status");
class RegisterFranchiseUseCase {
    constructor(clinicRepository, franchiseRepository, clinicMembershipRepository) {
        this.clinicRepository = clinicRepository;
        this.franchiseRepository = franchiseRepository;
        this.clinicMembershipRepository = clinicMembershipRepository;
    }
    async execute({ clinicId, userId, name, address, zipCode, description, }) {
        const clinic = await this.clinicRepository.findById(clinicId);
        if (!clinic) {
            return (0, either_1.makeLeft)(new clinic_not_found_error_1.ClinicNotFoundError());
        }
        const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(userId, clinicId);
        if (!clinicMembership || !clinicMembership.role.isOwner()) {
            return (0, either_1.makeLeft)(new user_is_not_owner_error_1.UserIsNotOwnerError());
        }
        const franchise = franchise_1.Franchise.create({
            clinicId: new unique_entity_id_1.UniqueEntityId(clinicId),
            name,
            address,
            zipCode,
            status: franchise_status_1.FranchiseStatus.active(),
            description,
        });
        await this.franchiseRepository.create(franchise);
        return (0, either_1.makeRight)({ franchise });
    }
}
exports.RegisterFranchiseUseCase = RegisterFranchiseUseCase;
//# sourceMappingURL=register-franchise.js.map
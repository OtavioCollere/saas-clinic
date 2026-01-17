"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditFranchiseUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const franchise_not_found_error_1 = require("../../../../core/errors/franchise-not-found-error");
const user_is_not_owner_error_1 = require("../../../../core/errors/user-is-not-owner-error");
class EditFranchiseUseCase {
    constructor(franchiseRepository, clinicMembershipRepository) {
        this.franchiseRepository = franchiseRepository;
        this.clinicMembershipRepository = clinicMembershipRepository;
    }
    async execute({ franchiseId, userId, name, address, zipCode, description, }) {
        const franchise = await this.franchiseRepository.findById(franchiseId);
        if (!franchise) {
            return (0, either_1.makeLeft)(new franchise_not_found_error_1.FranchiseNotFoundError());
        }
        const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(userId, franchise.clinicId.toString());
        if (!clinicMembership || !clinicMembership.role.isOwner()) {
            return (0, either_1.makeLeft)(new user_is_not_owner_error_1.UserIsNotOwnerError());
        }
        if (name)
            franchise.name = name;
        if (address)
            franchise.address = address;
        if (zipCode)
            franchise.zipCode = zipCode;
        if (description !== undefined)
            franchise.description = description;
        franchise.updatedAt = new Date();
        await this.franchiseRepository.update(franchise);
        return (0, either_1.makeRight)({ franchise });
    }
}
exports.EditFranchiseUseCase = EditFranchiseUseCase;
//# sourceMappingURL=edit-franchise.js.map
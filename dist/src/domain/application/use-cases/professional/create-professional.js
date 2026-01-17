"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProfessionalUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const franchise_not_found_error_1 = require("../../../../core/errors/franchise-not-found-error");
const professional_already_exists_error_1 = require("../../../../core/errors/professional-already-exists-error");
const user_is_not_owner_error_1 = require("../../../../core/errors/user-is-not-owner-error");
const user_not_found_error_1 = require("../../../../core/errors/user-not-found-error");
const professional_1 = require("../../../enterprise/entities/professional");
const council_1 = require("../../../enterprise/value-objects/council");
const profession_1 = require("../../../enterprise/value-objects/profession");
class CreateProfessionalUseCase {
    constructor(professionalRepository, franchiseRepository, usersRepository, clinicMembershipRepository) {
        this.professionalRepository = professionalRepository;
        this.franchiseRepository = franchiseRepository;
        this.usersRepository = usersRepository;
        this.clinicMembershipRepository = clinicMembershipRepository;
    }
    async execute({ franchiseId, userId, ownerId, council, councilNumber, councilState, profession, }) {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            return (0, either_1.makeLeft)(new user_not_found_error_1.UserNotFoundError());
        }
        const franchise = await this.franchiseRepository.findById(franchiseId);
        if (!franchise) {
            return (0, either_1.makeLeft)(new franchise_not_found_error_1.FranchiseNotFoundError());
        }
        const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(ownerId, franchise.clinicId.toString());
        if (!clinicMembership || !clinicMembership.role.isOwner()) {
            return (0, either_1.makeLeft)(new user_is_not_owner_error_1.UserIsNotOwnerError());
        }
        const existingProfessional = await this.professionalRepository.findByUserIdAndFranchiseId(userId, franchiseId);
        if (existingProfessional) {
            return (0, either_1.makeLeft)(new professional_already_exists_error_1.ProfessionalAlreadyExistsError());
        }
        const councilVO = council === 'CRM' ? council_1.Council.crm() : council_1.Council.crbm();
        const professionVO = profession === 'MEDICO' ? profession_1.Profession.medico() : profession_1.Profession.biomedico();
        const professional = professional_1.Professional.create({
            franchiseId: new unique_entity_id_1.UniqueEntityId(franchiseId),
            userId: new unique_entity_id_1.UniqueEntityId(userId),
            council: councilVO,
            councilNumber,
            councilState,
            profession: professionVO,
        });
        await this.professionalRepository.create(professional);
        return (0, either_1.makeRight)({ professional });
    }
}
exports.CreateProfessionalUseCase = CreateProfessionalUseCase;
//# sourceMappingURL=create-professional.js.map
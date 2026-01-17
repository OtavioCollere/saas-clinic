"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditProfessionalUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const professional_not_found_error_1 = require("../../../../core/errors/professional-not-found-error");
const user_is_not_owner_error_1 = require("../../../../core/errors/user-is-not-owner-error");
const council_1 = require("../../../enterprise/value-objects/council");
const profession_1 = require("../../../enterprise/value-objects/profession");
class EditProfessionalUseCase {
    constructor(professionalRepository, franchiseRepository, clinicMembershipRepository) {
        this.professionalRepository = professionalRepository;
        this.franchiseRepository = franchiseRepository;
        this.clinicMembershipRepository = clinicMembershipRepository;
    }
    async execute({ professionalId, editorId, council, councilNumber, councilState, profession, }) {
        const professional = await this.professionalRepository.findById(professionalId);
        if (!professional) {
            return (0, either_1.makeLeft)(new professional_not_found_error_1.ProfessionalNotFoundError());
        }
        const franchise = await this.franchiseRepository.findById(professional.franchiseId.toString());
        if (!franchise) {
            return (0, either_1.makeLeft)(new professional_not_found_error_1.ProfessionalNotFoundError());
        }
        const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(editorId, franchise.clinicId.toString());
        if (!clinicMembership || !clinicMembership.role.isOwner()) {
            return (0, either_1.makeLeft)(new user_is_not_owner_error_1.UserIsNotOwnerError());
        }
        if (council) {
            const councilVO = council === 'CRM' ? council_1.Council.crm() : council_1.Council.crbm();
            professional.council = councilVO;
        }
        if (councilNumber) {
            professional.councilNumber = councilNumber;
        }
        if (councilState) {
            professional.councilState = councilState;
        }
        if (profession) {
            const professionVO = profession === 'MEDICO' ? profession_1.Profession.medico() : profession_1.Profession.biomedico();
            professional.profession = professionVO;
        }
        professional.updatedAt = new Date();
        await this.professionalRepository.update(professional);
        return (0, either_1.makeRight)({ professional });
    }
}
exports.EditProfessionalUseCase = EditProfessionalUseCase;
//# sourceMappingURL=edit-professional.js.map
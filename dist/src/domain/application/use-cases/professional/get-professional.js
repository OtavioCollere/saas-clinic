"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfessionalUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const professional_not_found_error_1 = require("../../../../core/errors/professional-not-found-error");
class GetProfessionalUseCase {
    constructor(professionalRepository) {
        this.professionalRepository = professionalRepository;
    }
    async execute({ professionalId, }) {
        const professional = await this.professionalRepository.findById(professionalId);
        if (!professional) {
            return (0, either_1.makeLeft)(new professional_not_found_error_1.ProfessionalNotFoundError());
        }
        return (0, either_1.makeRight)({ professional });
    }
}
exports.GetProfessionalUseCase = GetProfessionalUseCase;
//# sourceMappingURL=get-professional.js.map
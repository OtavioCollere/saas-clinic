"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfessionalsByFranchiseIdUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const franchise_not_found_error_1 = require("../../../../core/errors/franchise-not-found-error");
class GetProfessionalsByFranchiseIdUseCase {
    constructor(professionalRepository, franchiseRepository) {
        this.professionalRepository = professionalRepository;
        this.franchiseRepository = franchiseRepository;
    }
    async execute({ franchiseId, }) {
        const franchise = await this.franchiseRepository.findById(franchiseId);
        if (!franchise) {
            return (0, either_1.makeLeft)(new franchise_not_found_error_1.FranchiseNotFoundError());
        }
        const professionals = await this.professionalRepository.findByFranchiseId(franchiseId);
        return (0, either_1.makeRight)({ professionals });
    }
}
exports.GetProfessionalsByFranchiseIdUseCase = GetProfessionalsByFranchiseIdUseCase;
//# sourceMappingURL=get-professionals-by-franchise-id.js.map
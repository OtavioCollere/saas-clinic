"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchFranchisesByClinicIdUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const clinic_not_found_error_1 = require("../../../../core/errors/clinic-not-found-error");
class FetchFranchisesByClinicIdUseCase {
    constructor(franchiseRepository, clinicRepository) {
        this.franchiseRepository = franchiseRepository;
        this.clinicRepository = clinicRepository;
    }
    async execute({ clinicId, }) {
        const clinic = await this.clinicRepository.findById(clinicId);
        if (!clinic) {
            return (0, either_1.makeLeft)(new clinic_not_found_error_1.ClinicNotFoundError());
        }
        const franchises = await this.franchiseRepository.findByClinicId(clinicId);
        return (0, either_1.makeRight)({ franchises });
    }
}
exports.FetchFranchisesByClinicIdUseCase = FetchFranchisesByClinicIdUseCase;
//# sourceMappingURL=fetch-franchises-by-clinic-id.js.map
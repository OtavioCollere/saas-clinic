"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetClinicByIdUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const clinic_not_found_error_1 = require("../../../../core/errors/clinic-not-found-error");
class GetClinicByIdUseCase {
    constructor(clinicRepository) {
        this.clinicRepository = clinicRepository;
    }
    async execute({ clinicId }) {
        const clinic = await this.clinicRepository.findById(clinicId);
        if (!clinic) {
            return (0, either_1.makeLeft)(new clinic_not_found_error_1.ClinicNotFoundError());
        }
        return (0, either_1.makeRight)({ clinic });
    }
}
exports.GetClinicByIdUseCase = GetClinicByIdUseCase;
//# sourceMappingURL=get-clinic-by-id.js.map
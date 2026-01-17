"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchClinicUseCase = void 0;
const either_1 = require("../../../../core/either/either");
class FetchClinicUseCase {
    constructor(clinicRepository) {
        this.clinicRepository = clinicRepository;
    }
    async execute({ page, pageSize = 20, query, }) {
        const clinics = await this.clinicRepository.fetch({
            page,
            pageSize,
            query,
        });
        return (0, either_1.makeRight)({ clinics });
    }
}
exports.FetchClinicUseCase = FetchClinicUseCase;
//# sourceMappingURL=fetch-clinic.js.map
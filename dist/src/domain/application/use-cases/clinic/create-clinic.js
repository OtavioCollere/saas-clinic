"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClinicUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const clinic_already_exists_error_1 = require("../../../../core/errors/clinic-already-exists-error");
const owner_not_found_error_1 = require("../../../../core/errors/owner-not-found-error");
const clinic_1 = require("../../../enterprise/entities/clinic");
const clinic_membership_1 = require("../../../enterprise/entities/clinic-membership");
const clinic_role_1 = require("../../../enterprise/value-objects/clinic-role");
const slug_1 = require("../../../enterprise/value-objects/slug");
class CreateClinicUseCase {
    constructor(clinicRepository, usersRepository, clinicMembershipRepository) {
        this.clinicRepository = clinicRepository;
        this.usersRepository = usersRepository;
        this.clinicMembershipRepository = clinicMembershipRepository;
    }
    async execute({ name, ownerId, description, avatarUrl }) {
        const user = await this.usersRepository.findById(ownerId);
        if (!user) {
            return (0, either_1.makeLeft)(new owner_not_found_error_1.OwnerNotFoundError());
        }
        const slug = slug_1.Slug.create(name);
        const existingClinic = await this.clinicRepository.findBySlug(slug.getValue());
        if (existingClinic) {
            return (0, either_1.makeLeft)(new clinic_already_exists_error_1.ClinicAlreadyExistsError());
        }
        const clinic = clinic_1.Clinic.create({
            name,
            ownerId: new unique_entity_id_1.UniqueEntityId(ownerId),
            description,
            avatarUrl,
        });
        await this.clinicRepository.create(clinic);
        const membership = clinic_membership_1.ClinicMembership.create({
            userId: new unique_entity_id_1.UniqueEntityId(ownerId),
            clinicId: clinic.id,
            role: clinic_role_1.ClinicRole.owner(),
        });
        await this.clinicMembershipRepository.create(membership);
        return (0, either_1.makeRight)({
            clinic,
        });
    }
}
exports.CreateClinicUseCase = CreateClinicUseCase;
//# sourceMappingURL=create-clinic.js.map
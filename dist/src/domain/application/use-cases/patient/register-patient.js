"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPatientUseCase = void 0;
const either_1 = require("../../../../core/either/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const clinic_not_found_error_1 = require("../../../../core/errors/clinic-not-found-error");
const user_not_found_error_1 = require("../../../../core/errors/user-not-found-error");
const anamnesis_1 = require("../../../enterprise/entities/anamnesis/anamnesis");
const patient_1 = require("../../../enterprise/entities/patient");
class RegisterPatientUseCase {
    constructor(patientRepository, anamnesisRepository, clinicRepository, usersRepository) {
        this.patientRepository = patientRepository;
        this.anamnesisRepository = anamnesisRepository;
        this.clinicRepository = clinicRepository;
        this.usersRepository = usersRepository;
    }
    async execute({ clinicId, personId, name, birthDay, address, zipCode, anamnesis: anamnesisData, }) {
        const clinic = await this.clinicRepository.findById(clinicId);
        if (!clinic) {
            return (0, either_1.makeLeft)(new clinic_not_found_error_1.ClinicNotFoundError());
        }
        const user = await this.usersRepository.findById(personId);
        if (!user) {
            return (0, either_1.makeLeft)(new user_not_found_error_1.UserNotFoundError());
        }
        const patient = patient_1.Patient.create({
            clinicId: new unique_entity_id_1.UniqueEntityId(clinicId),
            userId: new unique_entity_id_1.UniqueEntityId(personId),
            name,
            birthDay,
            address,
            zipCode,
            anamnesis: anamnesis_1.Anamnesis.create({
                patientId: new unique_entity_id_1.UniqueEntityId(),
                aestheticHistory: anamnesisData.aestheticHistory,
                healthConditions: anamnesisData.healthConditions,
                medicalHistory: anamnesisData.medicalHistory,
                physicalAssessment: anamnesisData.physicalAssessment,
            }),
        });
        patient.anamnesis.patientId = patient.id;
        await this.anamnesisRepository.create(patient.anamnesis);
        await this.patientRepository.create(patient);
        return (0, either_1.makeRight)({ patient });
    }
}
exports.RegisterPatientUseCase = RegisterPatientUseCase;
//# sourceMappingURL=register-patient.js.map
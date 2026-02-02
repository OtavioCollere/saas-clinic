import type { Anamnesis } from "@/domain/enterprise/entities/anamnesis/anamnesis";

export class AnamnesisPresenter {
	static toHTTP(anamnesis: Anamnesis) {
		return {
			id: anamnesis.id.toString(),
			patientId: anamnesis.patientId.toString(),
			aestheticHistory: anamnesis.aestheticHistory,
			healthConditions: anamnesis.healthConditions,
			medicalHistory: anamnesis.medicalHistory,
			physicalAssessment: anamnesis.physicalAssessment,
			createdAt: anamnesis.createdAt.toISOString(),
			updatedAt: anamnesis.updatedAt?.toISOString(),
		};
	}
}

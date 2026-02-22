import type { Patient } from "@/domain/enterprise/entities/patient";
import type { PatientWithUserData } from "@/domain/application/repositories/patient-repository";

export class PatientPresenter {
	static toHTTP(patient: Patient) {
		return {
			id: patient.id.toString(),
			clinicId: patient.clinicId.toString(),
			userId: patient.userId.toString(),
			name: patient.name,
			birthDay: patient.birthDay.toISOString(),
			address: patient.address,
			zipCode: patient.zipCode,
			createdAt: patient.createdAt.toISOString(),
			updatedAt: patient.updatedAt?.toISOString(),
		};
	}

	static toHTTPWithUser(patientWithUser: PatientWithUserData) {
		const { patient, userData, franchiseName, franchiseId, anamneseId, isAnamneseDone } = patientWithUser;
		return {
			id: patient.id.toString(),
			clinicId: patient.clinicId.toString(),
			userId: patient.userId.toString(),
			name: patient.name,
			birthDay: patient.birthDay.toISOString(),
			address: patient.address,
			zipCode: patient.zipCode,
			cpf: userData.cpf,
			email: userData.email,
			isEmailVerified: userData.isEmailVerified,
			franchiseName: franchiseName ?? null,
			franchiseId: franchiseId ?? null,
			anamneseId: anamneseId ?? null,
			isAnamneseDone,
			createdAt: patient.createdAt.toISOString(),
			updatedAt: patient.updatedAt?.toISOString(),
		};
	}
}

import type { Patient } from "@/domain/enterprise/entities/patient";

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
}

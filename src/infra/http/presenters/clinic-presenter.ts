import type { Clinic } from "@/domain/enterprise/entities/clinic";

export class ClinicPresenter {
	static toHTTP(clinic: Clinic) {
		return {
			id: clinic.id.toString(),
			ownerId: clinic.ownerId.toString(),
			name: clinic.name,
			slug: clinic.slug.getValue(),
			description: clinic.description,
			avatarUrl: clinic.avatarUrl,
			status: clinic.status.getValue(),
			createdAt: clinic.createdAt.toISOString(),
			updatedAt: clinic.updatedAt?.toISOString(),
		};
	}
}

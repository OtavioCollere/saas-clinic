import type { Franchise } from "@/domain/enterprise/entities/franchise";

export class FranchisePresenter {
	static toHTTP(franchise: Franchise) {
		return {
			id: franchise.id.toString(),
			clinicId: franchise.clinicId.toString(),
			name: franchise.name,
			address: franchise.address,
			zipCode: franchise.zipCode,
			status: franchise.status.getValue(),
			description: franchise.description,
			createdAt: franchise.createdAt.toISOString(),
			updatedAt: franchise.updatedAt?.toISOString(),
		};
	}
}

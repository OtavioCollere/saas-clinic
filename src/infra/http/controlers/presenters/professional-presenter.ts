import type { Professional } from "@/domain/enterprise/entities/professional";

export class ProfessionalPresenter {
	static toHTTP(professional: Professional) {
		return {
			id: professional.id.toString(),
			franchiseId: professional.franchiseId.toString(),
			userId: professional.userId.toString(),
			council: professional.council.getValue(),
			councilNumber: professional.councilNumber,
			councilState: professional.councilState,
			profession: professional.profession.getValue(),
			createdAt: professional.createdAt.toISOString(),
			updatedAt: professional.updatedAt?.toISOString(),
		};
	}
}

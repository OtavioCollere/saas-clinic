import type { Professional } from "@/domain/enterprise/entities/professional";
import type { User } from "@/domain/enterprise/entities/user";

export class ProfessionalPresenter {
	static toHTTP(professional: Professional, user?: User) {
		return {
			id: professional.id.toString(),
			franchiseId: professional.franchiseId.toString(),
			userId: professional.userId.toString(),
			name: user?.name ?? null,
			council: professional.council?.getValue(),
			councilNumber: professional.councilNumber,
			councilState: professional.councilState,
			profession: professional.profession.getValue(),
			createdAt: professional.createdAt.toISOString(),
			updatedAt: professional.updatedAt?.toISOString(),
		};
	}
}

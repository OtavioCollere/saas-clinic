import type { User } from "@/domain/enterprise/entities/user";

export class UserPresenter {
	static toHTTP(user: User) {
		return {
			id: user.id.toString(),
			name: user.name,
			cpf: user.cpf.toString(),
			email: user.email.toString(),
			role: user.role.getValue(),
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt?.toISOString(),
		};
	}
}

import type { User } from "@/domain/enterprise/entities/user";

export class UserPresenter {
	static toHTTP(user: User) {
		return {
			id: user.id.toString(),
			name: user.name,
			cpf: user.cpf.getValue(),
			email: user.email.getValue(),
			role: user.role.getValue(),
			isEmailVerified: user.isEmailVerified,
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt?.toISOString(),
		};
	}
}

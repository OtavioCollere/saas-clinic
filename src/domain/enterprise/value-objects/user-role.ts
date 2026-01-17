export type UserRoleType = "ADMIN" | "MEMBER";

export class UserRole {
	constructor(private readonly value: UserRoleType) {}

	static admin() {
		return new UserRole("ADMIN");
	}

	static member() {
		return new UserRole("MEMBER");
	}

	isAdmin() {
		return this.value === "ADMIN";
	}

	isMember() {
		return this.value === "MEMBER";
	}

	getValue(): UserRoleType {
		return this.value;
	}
}

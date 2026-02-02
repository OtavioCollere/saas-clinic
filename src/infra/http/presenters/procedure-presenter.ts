import type { Procedure } from "@/domain/enterprise/entities/procedure";

export class ProcedurePresenter {
	static toHTTP(procedure: Procedure) {
		return {
			id: procedure.id.toString(),
			franchiseId: procedure.franchiseId.toString(),
			name: procedure.name,
			price: procedure.price,
			notes: procedure.notes,
			status: procedure.status.getValue(),
			createdAt: procedure.createdAt.toISOString(),
			updatedAt: procedure.updatedAt?.toISOString(),
		};
	}
}

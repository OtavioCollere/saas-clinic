import type { InventoryItem } from "@/domain/enterprise/entities/inventory-item";

export class InventoryItemPresenter {
	static toHTTP(item: InventoryItem) {
		return {
			id: item.id.toString(),
			clinicId: item.clinicId.toString(),
			franchiseId: item.franchiseId?.toString() ?? null,
			name: item.name,
			category: item.category.getValue(),
			unitType: item.unitType,
			currentQuantity: item.currentQuantity,
			minimumQuantity: item.minimumQuantity,
			averageCost: item.averageCost,
			supplier: item.supplier ?? null,
			active: item.active,
			isBelowMinimum: item.isBelowMinimum,
			isNearMinimum: item.isNearMinimum,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt ?? null,
		};
	}
}

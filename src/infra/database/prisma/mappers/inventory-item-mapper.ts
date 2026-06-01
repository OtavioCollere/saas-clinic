import { InventoryItem } from "@/domain/enterprise/entities/inventory-item";
import { InventoryCategory } from "@/domain/enterprise/value-objects/inventory-category";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import type { Decimal } from "@prisma/client/runtime/library";

type Raw = {
	id: string;
	clinicId: string;
	franchiseId: string | null;
	name: string;
	category: string;
	unitType: string;
	currentQuantity: Decimal | number | string;
	minimumQuantity: Decimal | number | string;
	averageCost: Decimal | number | string;
	supplier: string | null;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
};

const toNum = (v: Decimal | number | string) =>
	typeof v === "number" ? v : Number.parseFloat(String(v));

export class InventoryItemMapper {
	static toDomain(raw: Raw): InventoryItem {
		return InventoryItem.create(
			{
				clinicId: new UniqueEntityId(raw.clinicId),
				franchiseId: raw.franchiseId
					? new UniqueEntityId(raw.franchiseId)
					: undefined,
				name: raw.name,
				category: InventoryCategory.create(raw.category),
				unitType: raw.unitType,
				currentQuantity: toNum(raw.currentQuantity),
				minimumQuantity: toNum(raw.minimumQuantity),
				averageCost: toNum(raw.averageCost),
				supplier: raw.supplier ?? undefined,
				active: raw.active,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id),
		);
	}

	static toPrismaCreate(item: InventoryItem) {
		return {
			id: item.id.toString(),
			clinic: { connect: { id: item.clinicId.toString() } },
			...(item.franchiseId
				? { franchise: { connect: { id: item.franchiseId.toString() } } }
				: {}),
			name: item.name,
			category: item.category.getValue(),
			unitType: item.unitType,
			currentQuantity: item.currentQuantity,
			minimumQuantity: item.minimumQuantity,
			averageCost: item.averageCost,
			supplier: item.supplier ?? null,
			active: item.active,
			createdAt: item.createdAt,
		};
	}

	static toPrismaUpdate(item: InventoryItem) {
		return {
			name: item.name,
			category: item.category.getValue(),
			unitType: item.unitType,
			currentQuantity: item.currentQuantity,
			minimumQuantity: item.minimumQuantity,
			averageCost: item.averageCost,
			supplier: item.supplier ?? null,
			active: item.active,
			updatedAt: item.updatedAt ?? new Date(),
		};
	}
}

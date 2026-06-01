import { Entity } from "@/shared/entities/entity";
import type { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import type { InventoryCategory } from "../value-objects/inventory-category";

export interface InventoryItemProps {
	clinicId: UniqueEntityId;
	franchiseId?: UniqueEntityId;
	name: string;
	category: InventoryCategory;
	unitType: string;
	currentQuantity: number;
	minimumQuantity: number;
	averageCost: number;
	supplier?: string;
	active: boolean;
	createdAt: Date;
	updatedAt?: Date;
}

export class InventoryItem extends Entity<InventoryItemProps> {
	static create(
		props: Omit<InventoryItemProps, "createdAt" | "active"> &
			Partial<Pick<InventoryItemProps, "createdAt" | "active">>,
		id?: UniqueEntityId,
	) {
		return new InventoryItem(
			{
				...props,
				active: props.active ?? true,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
	}

	get clinicId() {
		return this.props.clinicId;
	}
	get franchiseId() {
		return this.props.franchiseId;
	}
	get name() {
		return this.props.name;
	}
	get category() {
		return this.props.category;
	}
	get unitType() {
		return this.props.unitType;
	}
	get currentQuantity() {
		return this.props.currentQuantity;
	}
	get minimumQuantity() {
		return this.props.minimumQuantity;
	}
	get averageCost() {
		return this.props.averageCost;
	}
	get supplier() {
		return this.props.supplier;
	}
	get active() {
		return this.props.active;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}

	get isBelowMinimum() {
		return this.props.currentQuantity <= this.props.minimumQuantity;
	}
	get isNearMinimum() {
		return this.props.currentQuantity <= this.props.minimumQuantity * 1.2;
	}

	addStock(quantity: number, newAvgCost: number) {
		this.props.currentQuantity += quantity;
		this.props.averageCost = newAvgCost;
		this.props.updatedAt = new Date();
	}

	removeStock(quantity: number) {
		this.props.currentQuantity -= quantity;
		this.props.updatedAt = new Date();
	}

	update(
		data: Partial<
			Pick<
				InventoryItemProps,
				| "name"
				| "category"
				| "unitType"
				| "minimumQuantity"
				| "supplier"
				| "active"
				| "franchiseId"
			>
		>,
	) {
		Object.assign(this.props, data);
		this.props.updatedAt = new Date();
	}

	deactivate() {
		this.props.active = false;
		this.props.updatedAt = new Date();
	}
}

export const INVENTORY_CATEGORY_VALUES = [
	"PREENCHEDOR",
	"TOXINA_BOTULINICA",
	"ANESTESICO",
	"BIOESTIMULADOR",
	"FIOS",
	"PEELING",
	"SKINCARE",
	"MATERIAL_DESCARTAVEL",
	"MEDICAMENTO",
	"OUTRO",
] as const;

export type InventoryCategoryType = (typeof INVENTORY_CATEGORY_VALUES)[number];

const NORMALIZED_CATEGORY_MAP: Record<string, InventoryCategoryType> = {
	PREENCHEDOR: "PREENCHEDOR",
	PREENCHEDORES: "PREENCHEDOR",
	TOXINA: "TOXINA_BOTULINICA",
	TOXINA_BOTULINICA: "TOXINA_BOTULINICA",
	TOXINA_BOTULÍNICA: "TOXINA_BOTULINICA",
	ANESTESICO: "ANESTESICO",
	ANESTÉSICO: "ANESTESICO",
	BIOESTIMULADOR: "BIOESTIMULADOR",
	BIOESTIMULADORES: "BIOESTIMULADOR",
	FIOS: "FIOS",
	FIO: "FIOS",
	PEELING: "PEELING",
	PEELINGS: "PEELING",
	SKINCARE: "SKINCARE",
	MATERIAL_DESCARTAVEL: "MATERIAL_DESCARTAVEL",
	MATERIAL_DESCARTÁVEL: "MATERIAL_DESCARTAVEL",
	DESCARTAVEL: "MATERIAL_DESCARTAVEL",
	DESCARTÁVEL: "MATERIAL_DESCARTAVEL",
	MEDICAMENTO: "MEDICAMENTO",
	MEDICAMENTOS: "MEDICAMENTO",
	OUTRO: "OUTRO",
};

export class InventoryCategory {
	private constructor(private readonly value: InventoryCategoryType) {}

	static create(value: string): InventoryCategory {
    const normalized = value.trim().toUpperCase().replace(/\s+/g, "_");
		const category = NORMALIZED_CATEGORY_MAP[normalized];

		if (!category) {
			throw new Error(`Invalid inventory category: ${value}`);
		}

		return new InventoryCategory(category);
	}

	getValue(): InventoryCategoryType {
		return this.value;
	}
}

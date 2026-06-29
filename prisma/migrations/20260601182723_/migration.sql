/*
  Warnings:

  - You are about to drop the column `productId` on the `service_order_items` table. All the data in the column will be lost.
  - You are about to drop the column `consumptionStatus` on the `service_orders` table. All the data in the column will be lost.
  - You are about to drop the `inventory_entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_movements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `procedure_supply_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "inventory_entries" DROP CONSTRAINT "inventory_entries_inventoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_items" DROP CONSTRAINT "inventory_items_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_items" DROP CONSTRAINT "inventory_items_franchiseId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_movements" DROP CONSTRAINT "inventory_movements_inventoryEntryId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_movements" DROP CONSTRAINT "inventory_movements_inventoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "procedure_supply_templates" DROP CONSTRAINT "procedure_supply_templates_inventoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "procedure_supply_templates" DROP CONSTRAINT "procedure_supply_templates_procedureId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_franchiseId_fkey";

-- DropForeignKey
ALTER TABLE "service_order_items" DROP CONSTRAINT "service_order_items_productId_fkey";

-- DropIndex
DROP INDEX "service_order_items_productId_idx";

-- AlterTable
ALTER TABLE "anamnesis" ADD COLUMN     "signedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "service_order_items" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "service_orders" DROP COLUMN "consumptionStatus";

-- DropTable
DROP TABLE "inventory_entries";

-- DropTable
DROP TABLE "inventory_items";

-- DropTable
DROP TABLE "inventory_movements";

-- DropTable
DROP TABLE "procedure_supply_templates";

-- DropTable
DROP TABLE "products";

-- CreateTable
CREATE TABLE "anamnesis_history" (
    "id" TEXT NOT NULL,
    "anamnesisId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "aestheticHistory" JSONB NOT NULL,
    "healthConditions" JSONB NOT NULL,
    "medicalHistory" JSONB NOT NULL,
    "physicalAssessment" JSONB NOT NULL,
    "patientSignature" TEXT,
    "signedAt" TIMESTAMP(3),
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anamnesis_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "anamnesis_history_anamnesisId_idx" ON "anamnesis_history"("anamnesisId");

-- CreateIndex
CREATE INDEX "anamnesis_history_patientId_idx" ON "anamnesis_history"("patientId");

-- AddForeignKey
ALTER TABLE "anamnesis_history" ADD CONSTRAINT "anamnesis_history_anamnesisId_fkey" FOREIGN KEY ("anamnesisId") REFERENCES "anamnesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

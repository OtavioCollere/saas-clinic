-- AlterTable
ALTER TABLE "service_order_items" ADD COLUMN     "productId" TEXT;

-- AlterTable
ALTER TABLE "service_orders" ADD COLUMN     "consumptionStatus" TEXT;

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "costPrice" DECIMAL(10,2),
    "notes" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "franchiseId" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unitType" TEXT NOT NULL,
    "currentQuantity" DECIMAL(15,4) NOT NULL DEFAULT 0,
    "minimumQuantity" DECIMAL(15,4) NOT NULL DEFAULT 0,
    "averageCost" DECIMAL(15,4) NOT NULL DEFAULT 0,
    "supplier" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_entries" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "quantity" DECIMAL(15,4) NOT NULL,
    "unitCost" DECIMAL(15,4) NOT NULL,
    "totalCost" DECIMAL(15,4) NOT NULL,
    "supplier" TEXT,
    "batchNumber" TEXT,
    "expirationDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedure_supply_templates" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "defaultQuantity" DECIMAL(15,4) NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procedure_supply_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" DECIMAL(15,4) NOT NULL,
    "unitCost" DECIMAL(15,4),
    "reason" TEXT,
    "appointmentId" TEXT,
    "serviceOrderId" TEXT,
    "inventoryEntryId" TEXT,
    "professionalId" TEXT,
    "franchiseId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_franchiseId_idx" ON "products"("franchiseId");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "inventory_items_clinicId_idx" ON "inventory_items"("clinicId");

-- CreateIndex
CREATE INDEX "inventory_items_franchiseId_idx" ON "inventory_items"("franchiseId");

-- CreateIndex
CREATE INDEX "inventory_items_active_idx" ON "inventory_items"("active");

-- CreateIndex
CREATE INDEX "inventory_entries_clinicId_idx" ON "inventory_entries"("clinicId");

-- CreateIndex
CREATE INDEX "inventory_entries_inventoryItemId_idx" ON "inventory_entries"("inventoryItemId");

-- CreateIndex
CREATE INDEX "procedure_supply_templates_clinicId_idx" ON "procedure_supply_templates"("clinicId");

-- CreateIndex
CREATE INDEX "procedure_supply_templates_procedureId_idx" ON "procedure_supply_templates"("procedureId");

-- CreateIndex
CREATE INDEX "procedure_supply_templates_inventoryItemId_idx" ON "procedure_supply_templates"("inventoryItemId");

-- CreateIndex
CREATE UNIQUE INDEX "procedure_supply_templates_procedureId_inventoryItemId_key" ON "procedure_supply_templates"("procedureId", "inventoryItemId");

-- CreateIndex
CREATE INDEX "inventory_movements_clinicId_idx" ON "inventory_movements"("clinicId");

-- CreateIndex
CREATE INDEX "inventory_movements_inventoryItemId_idx" ON "inventory_movements"("inventoryItemId");

-- CreateIndex
CREATE INDEX "inventory_movements_serviceOrderId_idx" ON "inventory_movements"("serviceOrderId");

-- CreateIndex
CREATE INDEX "inventory_movements_type_idx" ON "inventory_movements"("type");

-- CreateIndex
CREATE INDEX "inventory_movements_createdAt_idx" ON "inventory_movements"("createdAt");

-- CreateIndex
CREATE INDEX "service_order_items_productId_idx" ON "service_order_items"("productId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "franchises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_items" ADD CONSTRAINT "service_order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_entries" ADD CONSTRAINT "inventory_entries_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_supply_templates" ADD CONSTRAINT "procedure_supply_templates_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "procedures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_supply_templates" ADD CONSTRAINT "procedure_supply_templates_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_inventoryEntryId_fkey" FOREIGN KEY ("inventoryEntryId") REFERENCES "inventory_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

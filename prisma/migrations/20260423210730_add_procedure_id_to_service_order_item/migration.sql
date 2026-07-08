-- AlterTable
ALTER TABLE "service_order_items" ADD COLUMN     "procedureId" TEXT;

-- CreateIndex
CREATE INDEX "service_order_items_procedureId_idx" ON "service_order_items"("procedureId");

-- AddForeignKey
ALTER TABLE "service_order_items" ADD CONSTRAINT "service_order_items_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "procedures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "clinics" ADD COLUMN     "zapClientToken" TEXT,
ADD COLUMN     "zapInstanceId" TEXT,
ADD COLUMN     "zapToken" TEXT;

-- AlterTable
ALTER TABLE "service_orders" ADD COLUMN     "appointmentId" TEXT,
ADD COLUMN     "franchiseId" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "service_orders_franchiseId_idx" ON "service_orders"("franchiseId");

-- CreateIndex
CREATE INDEX "service_orders_appointmentId_idx" ON "service_orders"("appointmentId");

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "whatsapp_conversations" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "patientId" TEXT,
    "professionalId" TEXT,
    "selectedDate" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "whatsapp_conversations_phoneNumber_idx" ON "whatsapp_conversations"("phoneNumber");

-- CreateIndex
CREATE INDEX "whatsapp_conversations_franchiseId_idx" ON "whatsapp_conversations"("franchiseId");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_conversations_phoneNumber_franchiseId_key" ON "whatsapp_conversations"("phoneNumber", "franchiseId");

-- AddForeignKey
ALTER TABLE "whatsapp_conversations" ADD CONSTRAINT "whatsapp_conversations_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "franchises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

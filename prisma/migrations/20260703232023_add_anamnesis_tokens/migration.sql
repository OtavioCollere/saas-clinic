-- CreateTable
CREATE TABLE "anamnesis_tokens" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anamnesis_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anamnesis_tokens_token_key" ON "anamnesis_tokens"("token");

-- CreateIndex
CREATE INDEX "anamnesis_tokens_token_idx" ON "anamnesis_tokens"("token");

-- CreateIndex
CREATE INDEX "anamnesis_tokens_patientId_status_idx" ON "anamnesis_tokens"("patientId", "status");

-- AddForeignKey
ALTER TABLE "anamnesis_tokens" ADD CONSTRAINT "anamnesis_tokens_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anamnesis_tokens" ADD CONSTRAINT "anamnesis_tokens_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

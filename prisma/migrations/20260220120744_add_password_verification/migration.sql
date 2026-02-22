-- CreateTable
CREATE TABLE "password_verifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_verifications_token_key" ON "password_verifications"("token");

-- CreateIndex
CREATE INDEX "password_verifications_userId_idx" ON "password_verifications"("userId");

-- CreateIndex
CREATE INDEX "password_verifications_token_idx" ON "password_verifications"("token");

-- AddForeignKey
ALTER TABLE "password_verifications" ADD CONSTRAINT "password_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

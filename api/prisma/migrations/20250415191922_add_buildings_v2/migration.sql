-- AlterEnum
ALTER TYPE "APIKeyScopes" ADD VALUE 'BUILDING_EDIT';

-- CreateTable
CREATE TABLE "Building" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "hours" JSONB NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "APIKeyScopes" ADD VALUE 'HOUSING_EDIT';


-- CreateTable
CREATE TABLE "Housing" (
    "id" SERIAL NOT NULL,
    "updated" TIMESTAMPTZ(6) NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "students" TEXT NOT NULL DEFAULT '',
    "distance" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "imageURL" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Housing_pkey" PRIMARY KEY ("id")
);

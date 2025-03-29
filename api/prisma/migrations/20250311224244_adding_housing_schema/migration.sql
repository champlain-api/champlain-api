-- AlterEnum
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

/*
  Warnings:

  - You are about to drop the `Housing` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "APIKeyScopes" ADD VALUE 'COMPETENCIES_EDIT';


-- CreateTable
CREATE TABLE "Competencies" (
    "id" SERIAL NOT NULL,
    "updated" TIMESTAMPTZ(6) NOT NULL,
    "competency" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "criteria" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "information" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Competencies_pkey" PRIMARY KEY ("id")
);


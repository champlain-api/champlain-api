-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "APIKeyScopes" ADD VALUE 'COURSES_EDIT';
ALTER TYPE "APIKeyScopes" ADD VALUE 'SEMESTER_EDIT';

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "number" TEXT NOT NULL DEFAULT '',
    "credit" INTEGER NOT NULL DEFAULT 0,
    "openseats" INTEGER NOT NULL DEFAULT 0,
    "days" TEXT,
    "times" TEXT,
    "instructor_name" TEXT,
    "description" TEXT,
    "room" TEXT,
    "subject" TEXT,
    "type" TEXT,
    "prereq" TEXT,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "end_date" TIMESTAMPTZ(6) NOT NULL,
    "semesterId" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "year" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

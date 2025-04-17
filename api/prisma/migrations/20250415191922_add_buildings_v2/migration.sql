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

-- AlterEnum
ALTER TYPE "APIKeyScopes" ADD VALUE 'COURSES_EDIT';
-- AlterEnum
ALTER TYPE "APIKeyScopes" ADD VALUE 'SEMESTER_EDIT';

-- CreateTable for Semester
CREATE TABLE "Semester" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT ''
);

-- CreateTable for Course
CREATE TABLE "Course" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT '',
    "number" TEXT NOT NULL DEFAULT '',
    "credit" INTEGER NOT NULL DEFAULT 0,
    "openseats" INTEGER NOT NULL DEFAULT 0,
    "days" TEXT NOT NULL DEFAULT '',
    "times" TEXT NOT NULL DEFAULT '',
    "instructor_name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "room" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "prereq" TEXT NOT NULL DEFAULT '',
    "start_date" TIMESTAMPTZ NOT NULL,
    "end_date" TIMESTAMPTZ NOT NULL,
    "semesterId" INTEGER NOT NULL,
    CONSTRAINT "Course_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE
);

-- constraint for semester table
ALTER TABLE "Semester" ADD CONSTRAINT "Semester_name_key" UNIQUE ("name");
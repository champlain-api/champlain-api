-- CreateEnum
CREATE TYPE "AnnouncementStyle" AS ENUM ('EMERGENCY', 'INFO');

-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('WEB', 'SHUTTLE', 'MOBILE');

-- CreateEnum
CREATE TYPE "APIKeyScopes" AS ENUM ('ANNOUNCEMENTS_EDIT', 'SHUTTLE_EDIT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "updated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL DEFAULT 'Champlain College Announcement',
    "description" TEXT NOT NULL DEFAULT '',
    "type" "AnnouncementType"[] DEFAULT ARRAY['WEB']::"AnnouncementType"[],
    "style" "AnnouncementStyle" NOT NULL DEFAULT 'INFO',

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shuttle" (
    "id" SERIAL NOT NULL,
    "updated" TIMESTAMPTZ NOT NULL,
    "lat" INTEGER NOT NULL DEFAULT 0,
    "lon" INTEGER NOT NULL DEFAULT 0,
    "mph" INTEGER NOT NULL DEFAULT 0,
    "direction" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Shuttle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apiKey" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "scopes" "APIKeyScopes"[],
    "userID" INTEGER NOT NULL,

    CONSTRAINT "apiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" SERIAL NOT NULL,
    "updated" TIMESTAMPTZ(6) NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "departments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageURL" TEXT NOT NULL DEFAULT 'https://www.champlain.edu/app/uploads/2023/10/cc-people-placeholder-400x400.jpg',

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "apiKey_key_key" ON "apiKey"("key");

-- AddForeignKey
ALTER TABLE "apiKey" ADD CONSTRAINT "apiKey_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- constraint for semester table
ALTER TABLE "Semester" ADD CONSTRAINT "Semester_name_key" UNIQUE ("name");


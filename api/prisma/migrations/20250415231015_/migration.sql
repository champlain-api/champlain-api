-- CreateEnum
CREATE TYPE "AnnouncementStyle" AS ENUM ('EMERGENCY', 'INFO');

-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('WEB', 'SHUTTLE', 'MOBILE');

-- CreateEnum
CREATE TYPE "APIKeyScopes" AS ENUM ('ANNOUNCEMENTS_EDIT', 'SHUTTLE_EDIT', 'FACULTY_EDIT', 'DINING_EDIT');

-- CreateEnum
CREATE TYPE "station" AS ENUM ('SIZZLE', 'SLICES', 'BAKERY', 'RISE', 'SAVORY', 'THE_BREAKFAST_BAR', 'SALAD_BAR', 'SHOWCASE', 'VEGETABLE', 'RUSTIC_ROOTS', 'SOUP', 'CEREAL', 'DELI', 'STARCH', 'OMELET', 'ENTREE', 'BREAKFAST', 'APPETIZER', 'HAVE_A_NICE_DAY');

-- CreateEnum
CREATE TYPE "mealType" AS ENUM ('DINNER', 'LATE_NIGHT', 'BREAKFAST', 'LUNCH', 'MORNING_BREAK', 'BRUNCH');

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

-- CreateTable
CREATE TABLE "DailyMenu" (
    "id" SERIAL NOT NULL,
    "dayofWeek" TEXT NOT NULL DEFAULT 'Monday',

    CONSTRAINT "DailyMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "station" "station"[],
    "type" "mealType"[],

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DailyMenuToMeal" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DailyMenuToMeal_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "apiKey_key_key" ON "apiKey"("key");

-- CreateIndex
CREATE INDEX "_DailyMenuToMeal_B_index" ON "_DailyMenuToMeal"("B");

-- AddForeignKey
ALTER TABLE "apiKey" ADD CONSTRAINT "apiKey_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DailyMenuToMeal" ADD CONSTRAINT "_DailyMenuToMeal_A_fkey" FOREIGN KEY ("A") REFERENCES "DailyMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DailyMenuToMeal" ADD CONSTRAINT "_DailyMenuToMeal_B_fkey" FOREIGN KEY ("B") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

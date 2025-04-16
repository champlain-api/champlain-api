-- CreateEnum
CREATE TYPE "station" AS ENUM ('SIZZLE', 'SLICES', 'BAKERY', 'RISE', 'SAVORY', 'THE_BREAKFAST_BAR', 'SALAD_BAR', 'SHOWCASE', 'VEGETABLE', 'RUSTIC_ROOTS', 'SOUP', 'CEREAL', 'DELI', 'STARCH', 'OMELET', 'ENTREE', 'BREAKFAST', 'APPETIZER', 'HAVE_A_NICE_DAY', 'WAFFLE_BAR', 'PIZZA');

-- CreateEnum
CREATE TYPE "mealType" AS ENUM ('DINNER', 'LATE_NIGHT', 'BREAKFAST', 'LUNCH', 'MORNING_BREAK', 'BRUNCH');

-- AlterEnum
ALTER TYPE "APIKeyScopes" ADD VALUE 'DINING_EDIT';

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
CREATE INDEX "_DailyMenuToMeal_B_index" ON "_DailyMenuToMeal"("B");

-- AddForeignKey
ALTER TABLE "_DailyMenuToMeal" ADD CONSTRAINT "_DailyMenuToMeal_A_fkey" FOREIGN KEY ("A") REFERENCES "DailyMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DailyMenuToMeal" ADD CONSTRAINT "_DailyMenuToMeal_B_fkey" FOREIGN KEY ("B") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "station" ADD VALUE 'OMELET';
ALTER TYPE "station" ADD VALUE 'ENTREE';
ALTER TYPE "station" ADD VALUE 'BREAKFAST';
ALTER TYPE "station" ADD VALUE 'APPETIZER';
ALTER TYPE "station" ADD VALUE 'HAVE_A_NICE_DAY';

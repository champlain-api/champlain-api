/*
  Warnings:

  - You are about to drop the column `clubInfoId` on the `Officer` table. All the data in the column will be lost.
  - You are about to drop the `ClubInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `semester` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clubId` to the `Officer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClubInfo" DROP CONSTRAINT "ClubInfo_clubId_fkey";

-- DropForeignKey
ALTER TABLE "Officer" DROP CONSTRAINT "Officer_clubInfoId_fkey";

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "semester" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Officer" DROP COLUMN "clubInfoId",
ADD COLUMN     "clubId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ClubInfo";

-- AddForeignKey
ALTER TABLE "Officer" ADD CONSTRAINT "Officer_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

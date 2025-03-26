-- CreateTable
CREATE TABLE "Club" (
    "id" SERIAL NOT NULL,
    "updated" TIMESTAMPTZ NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "primaryContact" TEXT NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubInfo" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "semester" TEXT[],
    "clubId" INTEGER NOT NULL,

    CONSTRAINT "ClubInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Officer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clubInfoId" INTEGER NOT NULL,

    CONSTRAINT "Officer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ClubInfo_clubId_key" ON "ClubInfo"("clubId");

-- AddForeignKey
ALTER TABLE "ClubInfo" ADD CONSTRAINT "ClubInfo_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Officer" ADD CONSTRAINT "Officer_clubInfoId_fkey" FOREIGN KEY ("clubInfoId") REFERENCES "ClubInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

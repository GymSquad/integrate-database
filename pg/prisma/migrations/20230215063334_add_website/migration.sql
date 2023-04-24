/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Office` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Office` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `Office` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Office" DROP COLUMN "updatedAt",
DROP COLUMN "url",
DROP COLUMN "viewCount";

-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "officeId" TEXT NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

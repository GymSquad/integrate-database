/*
  Warnings:

  - You are about to drop the column `officeId` on the `Website` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url,name]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Website" DROP CONSTRAINT "Website_officeId_fkey";

-- AlterTable
ALTER TABLE "Website" DROP COLUMN "officeId";

-- CreateTable
CREATE TABLE "_OfficeToWebsite" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OfficeToWebsite_AB_unique" ON "_OfficeToWebsite"("A", "B");

-- CreateIndex
CREATE INDEX "_OfficeToWebsite_B_index" ON "_OfficeToWebsite"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Website_url_name_key" ON "Website"("url", "name");

-- AddForeignKey
ALTER TABLE "_OfficeToWebsite" ADD CONSTRAINT "_OfficeToWebsite_A_fkey" FOREIGN KEY ("A") REFERENCES "Office"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfficeToWebsite" ADD CONSTRAINT "_OfficeToWebsite_B_fkey" FOREIGN KEY ("B") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

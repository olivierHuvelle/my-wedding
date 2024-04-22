/*
  Warnings:

  - You are about to drop the column `city` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Guest` table. All the data in the column will be lost.
  - Made the column `lastName` on table `Guest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "city",
DROP COLUMN "number",
DROP COLUMN "street",
DROP COLUMN "zipCode",
ALTER COLUMN "lastName" SET NOT NULL;

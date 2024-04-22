/*
  Warnings:

  - You are about to drop the column `city` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Contact` table. All the data in the column will be lost.
  - Made the column `firstName` on table `Contact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "city",
DROP COLUMN "number",
DROP COLUMN "street",
DROP COLUMN "zipCode",
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;

/*
  Warnings:

  - You are about to drop the column `parentId` on the `Guest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_parentId_fkey";

-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "parentId";

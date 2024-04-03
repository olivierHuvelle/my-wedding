/*
  Warnings:

  - You are about to drop the column `City` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `Remark` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `Street` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `City` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `Remark` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `Street` on the `Guest` table. All the data in the column will be lost.
  - Added the required column `city` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remark` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Guest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "City",
DROP COLUMN "Remark",
DROP COLUMN "Street",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "remark" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "City",
DROP COLUMN "Remark",
DROP COLUMN "Street",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "street" TEXT NOT NULL;

/*
  Warnings:

  - The values [Adult,Child,None] on the enum `Menu` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Menu_new" AS ENUM ('Adulte', 'Enfant', 'Aucun');
ALTER TABLE "Guest" ALTER COLUMN "menu" TYPE "Menu_new" USING ("menu"::text::"Menu_new");
ALTER TYPE "Menu" RENAME TO "Menu_old";
ALTER TYPE "Menu_new" RENAME TO "Menu";
DROP TYPE "Menu_old";
COMMIT;

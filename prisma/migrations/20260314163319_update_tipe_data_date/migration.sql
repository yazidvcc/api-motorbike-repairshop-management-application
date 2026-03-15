/*
  Warnings:

  - Added the required column `time` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `time` TIME NOT NULL,
    MODIFY `date` DATE NOT NULL;

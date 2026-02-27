-- AlterTable
ALTER TABLE `items` ADD COLUMN `photo` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `mechanics` MODIFY `phone` VARCHAR(20) NULL,
    MODIFY `address` VARCHAR(255) NULL;

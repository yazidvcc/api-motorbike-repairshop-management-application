-- AlterTable
ALTER TABLE `orders` ADD COLUMN `customer_address` VARCHAR(255) NULL,
    ADD COLUMN `customer_name` VARCHAR(100) NULL,
    ADD COLUMN `customer_phone` VARCHAR(20) NULL,
    ADD COLUMN `status_order` ENUM('antrian', 'selesai') NOT NULL DEFAULT 'selesai';

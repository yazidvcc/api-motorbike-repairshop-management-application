/*
  Warnings:

  - A unique constraint covering the columns `[order_id,item_id]` on the table `order_details` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_mechanic_id_fkey`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `total_part` INTEGER NULL,
    ADD COLUMN `total_service` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `order_details_order_id_item_id_key` ON `order_details`(`order_id`, `item_id`);

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_mechanic_id_fkey` FOREIGN KEY (`mechanic_id`) REFERENCES `mechanics`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

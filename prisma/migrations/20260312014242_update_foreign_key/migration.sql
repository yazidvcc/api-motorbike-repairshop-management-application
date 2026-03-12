-- DropForeignKey
ALTER TABLE `order_details` DROP FOREIGN KEY `order_details_item_id_fkey`;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
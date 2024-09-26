/*
  Warnings:

  - You are about to drop the `detailtransaksi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `detailtransaksi` DROP FOREIGN KEY `DetailTransaksi_id_menu_fkey`;

-- DropForeignKey
ALTER TABLE `detailtransaksi` DROP FOREIGN KEY `DetailTransaksi_id_transaksi_fkey`;

-- DropTable
DROP TABLE `detailtransaksi`;

-- CreateTable
CREATE TABLE `Detail_Transaksi` (
    `id_detail_transaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_transaksi` INTEGER NOT NULL,
    `id_menu` INTEGER NOT NULL,
    `harga` INTEGER NOT NULL,

    PRIMARY KEY (`id_detail_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Detail_Transaksi` ADD CONSTRAINT `Detail_Transaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `Transaksi`(`id_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail_Transaksi` ADD CONSTRAINT `Detail_Transaksi_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `Menu`(`id_menu`) ON DELETE RESTRICT ON UPDATE CASCADE;

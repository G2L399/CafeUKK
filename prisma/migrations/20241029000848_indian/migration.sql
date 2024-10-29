/*
  Warnings:

  - The primary key for the `detail_transaksi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The values [Food,Beverage] on the enum `Menu_jenis` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `transaksi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The values [belum_bayar,lunas] on the enum `Transaksi_status` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The values [admin,cashier,manager] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `deskripsi` on table `menu` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gambar` on table `menu` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `detail_transaksi` DROP FOREIGN KEY `Detail_Transaksi_id_transaksi_fkey`;

-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `Transaksi_id_meja_fkey`;

-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `Transaksi_id_user_fkey`;

-- AlterTable
ALTER TABLE `detail_transaksi` DROP PRIMARY KEY,
    MODIFY `id_detail_transaksi` VARCHAR(191) NOT NULL,
    MODIFY `id_transaksi` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_detail_transaksi`);

-- AlterTable
ALTER TABLE `menu` MODIFY `jenis` ENUM('Foods', 'Drinks') NOT NULL,
    MODIFY `deskripsi` VARCHAR(191) NOT NULL,
    MODIFY `gambar` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `transaksi` DROP PRIMARY KEY,
    MODIFY `id_transaksi` VARCHAR(191) NOT NULL,
    MODIFY `id_user` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('Unpaid', 'Paid') NOT NULL,
    ADD PRIMARY KEY (`id_transaksi`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id_user` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('Admin', 'Cashier', 'Manager') NOT NULL,
    ADD PRIMARY KEY (`id_user`);

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_meja_fkey` FOREIGN KEY (`id_meja`) REFERENCES `Meja`(`id_meja`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Detail_Transaksi` ADD CONSTRAINT `Detail_Transaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `Transaksi`(`id_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;

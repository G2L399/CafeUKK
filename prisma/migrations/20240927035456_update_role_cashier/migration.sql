/*
  Warnings:

  - You are about to drop the column `harga` on the `detail_transaksi` table. All the data in the column will be lost.
  - Added the required column `jumlah` to the `Detail_Transaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_harga` to the `Detail_Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detail_transaksi` DROP COLUMN `harga`,
    ADD COLUMN `jumlah` INTEGER NOT NULL,
    ADD COLUMN `total_harga` INTEGER NOT NULL;

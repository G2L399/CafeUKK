/*
  Warnings:

  - Added the required column `total_harga` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `total_harga` INTEGER NOT NULL;

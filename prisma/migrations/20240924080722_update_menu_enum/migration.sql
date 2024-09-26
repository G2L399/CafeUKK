/*
  Warnings:

  - The values [makanan,minuman] on the enum `Menu_jenis` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `gambar` on the `menu` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `LongText`.

*/
-- AlterTable
ALTER TABLE `menu` MODIFY `jenis` ENUM('Food', 'Beverage') NOT NULL,
    MODIFY `gambar` LONGTEXT NULL;

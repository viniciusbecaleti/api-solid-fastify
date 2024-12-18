/*
  Warnings:

  - You are about to drop the column `user_id` on the `gyms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "gyms" DROP CONSTRAINT "gyms_user_id_fkey";

-- AlterTable
ALTER TABLE "gyms" DROP COLUMN "user_id";

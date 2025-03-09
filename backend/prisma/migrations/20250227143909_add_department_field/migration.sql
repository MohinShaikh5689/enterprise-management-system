/*
  Warnings:

  - Added the required column `Department` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "Department" TEXT NOT NULL;

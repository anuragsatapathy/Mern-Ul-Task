/*
  Warnings:

  - Made the column `token` on table `WorkspaceInvite` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WorkspaceInvite" ALTER COLUMN "token" SET NOT NULL;

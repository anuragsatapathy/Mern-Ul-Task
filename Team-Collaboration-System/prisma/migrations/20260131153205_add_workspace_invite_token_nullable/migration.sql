/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `WorkspaceInvite` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "WorkspaceInvite" ADD COLUMN     "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvite_token_key" ON "WorkspaceInvite"("token");

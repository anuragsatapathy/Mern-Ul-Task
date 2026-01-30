/*
  Warnings:

  - You are about to drop the column `accepted` on the `WorkspaceInvite` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `WorkspaceInvite` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "WorkspaceInvite_email_idx";

-- DropIndex
DROP INDEX "WorkspaceInvite_token_key";

-- AlterTable
ALTER TABLE "WorkspaceInvite" DROP COLUMN "accepted",
DROP COLUMN "token",
ADD COLUMN     "isAccepted" BOOLEAN NOT NULL DEFAULT false;

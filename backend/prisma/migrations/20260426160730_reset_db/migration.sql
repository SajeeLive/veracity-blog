/*
  Warnings:

  - You are about to drop the column `author_id` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the `authors` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[handle]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `handle` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "authors" DROP CONSTRAINT "authors_user_id_fkey";

-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_author_id_fkey";

-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "author_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "handle" TEXT NOT NULL;

-- DropTable
DROP TABLE "authors";

-- CreateIndex
CREATE UNIQUE INDEX "users_handle_key" ON "users"("handle");

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

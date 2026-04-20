/*
  Warnings:

  - The primary key for the `AccessRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ActivityLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Doc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DocType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DocsInGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `NotificationToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SharedDoc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserInGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `AccessRequest` DROP FOREIGN KEY `AccessRequest_requesterId_fkey`;

-- DropForeignKey
ALTER TABLE `AccessRequest` DROP FOREIGN KEY `AccessRequest_respondedId_fkey`;

-- DropForeignKey
ALTER TABLE `ActivityLog` DROP FOREIGN KEY `ActivityLog_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `ActivityLog` DROP FOREIGN KEY `ActivityLog_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Doc` DROP FOREIGN KEY `Doc_docTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `Doc` DROP FOREIGN KEY `Doc_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `DocType` DROP FOREIGN KEY `DocType_creatorId_fkey`;

-- DropForeignKey
ALTER TABLE `DocsInGroup` DROP FOREIGN KEY `DocsInGroup_docId_fkey`;

-- DropForeignKey
ALTER TABLE `DocsInGroup` DROP FOREIGN KEY `DocsInGroup_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `NotificationToUser` DROP FOREIGN KEY `NotificationToUser_notificationId_fkey`;

-- DropForeignKey
ALTER TABLE `NotificationToUser` DROP FOREIGN KEY `NotificationToUser_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- DropForeignKey
ALTER TABLE `SharedDoc` DROP FOREIGN KEY `SharedDoc_docId_fkey`;

-- DropForeignKey
ALTER TABLE `SharedDoc` DROP FOREIGN KEY `SharedDoc_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `UserInGroup` DROP FOREIGN KEY `UserInGroup_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `UserInGroup` DROP FOREIGN KEY `UserInGroup_userId_fkey`;

-- DropIndex
DROP INDEX `AccessRequest_requesterId_fkey` ON `AccessRequest`;

-- DropIndex
DROP INDEX `AccessRequest_respondedId_fkey` ON `AccessRequest`;

-- DropIndex
DROP INDEX `ActivityLog_groupId_fkey` ON `ActivityLog`;

-- DropIndex
DROP INDEX `ActivityLog_userId_fkey` ON `ActivityLog`;

-- DropIndex
DROP INDEX `Doc_docTypeId_fkey` ON `Doc`;

-- DropIndex
DROP INDEX `Doc_ownerId_fkey` ON `Doc`;

-- DropIndex
DROP INDEX `DocType_creatorId_fkey` ON `DocType`;

-- DropIndex
DROP INDEX `DocsInGroup_docId_fkey` ON `DocsInGroup`;

-- DropIndex
DROP INDEX `NotificationToUser_userId_fkey` ON `NotificationToUser`;

-- DropIndex
DROP INDEX `SharedDoc_receiverId_fkey` ON `SharedDoc`;

-- DropIndex
DROP INDEX `UserInGroup_userId_fkey` ON `UserInGroup`;

-- AlterTable
ALTER TABLE `AccessRequest` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `requesterId` VARCHAR(191) NOT NULL,
    MODIFY `respondedId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `ActivityLog` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `groupId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Doc` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `ownerId` VARCHAR(191) NOT NULL,
    MODIFY `docTypeId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `DocType` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `creatorId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `DocsInGroup` DROP PRIMARY KEY,
    MODIFY `groupId` VARCHAR(191) NOT NULL,
    MODIFY `docId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`groupId`, `docId`);

-- AlterTable
ALTER TABLE `Group` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Notification` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `NotificationToUser` DROP PRIMARY KEY,
    MODIFY `notificationId` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`notificationId`, `userId`);

-- AlterTable
ALTER TABLE `Profile` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userId`);

-- AlterTable
ALTER TABLE `SharedDoc` DROP PRIMARY KEY,
    MODIFY `receiverId` VARCHAR(191) NOT NULL,
    MODIFY `docId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`docId`, `receiverId`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `passwordHash`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UserInGroup` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `groupId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`groupId`, `userId`);

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doc` ADD CONSTRAINT `Doc_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doc` ADD CONSTRAINT `Doc_docTypeId_fkey` FOREIGN KEY (`docTypeId`) REFERENCES `DocType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocType` ADD CONSTRAINT `DocType_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedDoc` ADD CONSTRAINT `SharedDoc_docId_fkey` FOREIGN KEY (`docId`) REFERENCES `Doc`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedDoc` ADD CONSTRAINT `SharedDoc_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInGroup` ADD CONSTRAINT `UserInGroup_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInGroup` ADD CONSTRAINT `UserInGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocsInGroup` ADD CONSTRAINT `DocsInGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocsInGroup` ADD CONSTRAINT `DocsInGroup_docId_fkey` FOREIGN KEY (`docId`) REFERENCES `Doc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityLog` ADD CONSTRAINT `ActivityLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityLog` ADD CONSTRAINT `ActivityLog_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessRequest` ADD CONSTRAINT `AccessRequest_requesterId_fkey` FOREIGN KEY (`requesterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessRequest` ADD CONSTRAINT `AccessRequest_respondedId_fkey` FOREIGN KEY (`respondedId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationToUser` ADD CONSTRAINT `NotificationToUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationToUser` ADD CONSTRAINT `NotificationToUser_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE `Doc` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- RenameIndex
ALTER TABLE `AccessRequest` RENAME INDEX `AccessRequest_requesterId_fkey` TO `AccessRequest_requesterId_idx`;

-- RenameIndex
ALTER TABLE `AccessRequest` RENAME INDEX `AccessRequest_respondedId_fkey` TO `AccessRequest_respondedId_idx`;

-- RenameIndex
ALTER TABLE `Doc` RENAME INDEX `Doc_docTypeId_fkey` TO `Doc_docTypeId_idx`;

-- RenameIndex
ALTER TABLE `Doc` RENAME INDEX `Doc_ownerId_fkey` TO `Doc_ownerId_idx`;

-- RenameIndex
ALTER TABLE `DocsInGroup` RENAME INDEX `DocsInGroup_docId_fkey` TO `DocsInGroup_docId_idx`;

-- RenameIndex
ALTER TABLE `NotificationToUser` RENAME INDEX `NotificationToUser_userId_fkey` TO `NotificationToUser_userId_idx`;

-- RenameIndex
ALTER TABLE `SharedDoc` RENAME INDEX `SharedDoc_receiverId_fkey` TO `SharedDoc_receiverId_idx`;

-- RenameIndex
ALTER TABLE `UserInGroup` RENAME INDEX `UserInGroup_userId_fkey` TO `UserInGroup_userId_idx`;

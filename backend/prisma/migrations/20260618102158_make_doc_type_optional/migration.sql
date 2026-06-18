-- DropForeignKey
ALTER TABLE `Doc` DROP FOREIGN KEY `Doc_docTypeId_fkey`;

-- AlterTable
ALTER TABLE `Doc` MODIFY `docTypeId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Doc` ADD CONSTRAINT `Doc_docTypeId_fkey` FOREIGN KEY (`docTypeId`) REFERENCES `DocType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

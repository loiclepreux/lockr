/*
  Warnings:

  - The values [addDocInGroup,deleteDocInGroup,addUserInGroup,removeUserInGroup] on the enum `ActivityLog_actionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `ActivityLog` MODIFY `actionType` ENUM('CREATE_DOCUMENT', 'UPDATE_DOCUMENT', 'DELETE_DOCUMENT', 'SHARE_DOCUMENT', 'REVOKE_SHARE', 'ADD_DOC_IN_GROUP', 'REMOVE_DOC_IN_GROUP', 'ADD_USER_IN_GROUP', 'REMOVE_USER_IN_GROUP', 'CREATE_GROUP', 'UPDATE_GROUP', 'DELETE_GROUP') NOT NULL;

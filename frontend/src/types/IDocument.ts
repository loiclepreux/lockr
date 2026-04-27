// src/types/IDocument.ts
// Shape réel retourné par GET /documents — on retire mockDocuments et ses types numériques
export type ExtensionEnum =
  | "pdf"
  | "docx"
  | "mp3"
  | "webp"
  | "mp4"
  | "png"
  | "jpg"
  | "jpeg";
export type DocStatus = "ACTIVE" | "ARCHIVED" | "DELETED";

export interface IDocument {
  id: string; // UUID — pas un nombre comme dans mockDocuments
  name: string;
  extension: ExtensionEnum;
  ownerId: string;
  size: string; // BigInt sérialisé en string par le back
  docTypeId: string;
  status: DocStatus;
  addedDate: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
}

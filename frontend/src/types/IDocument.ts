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

export type DocPriority = "LOW" | "MEDIUM" | "HIGH";

export interface IDocument {
  id: string; // UUID — 
  name: string;
  extension: ExtensionEnum;
  ownerId: string;
  size: string; // BigInt sérialisé en string par le back
  docTypeId: string;
  status: DocStatus;
  priority: DocPriority;
  addedDate: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
}

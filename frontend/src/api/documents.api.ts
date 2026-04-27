// src/api/documents.api.ts
import { api } from "../utils/axios-client";
import type { IDocument } from "../types/IDocument";

// ─── RÉCUPÉRER MES DOCUMENTS ────────────────────────────────────────────────
// Le back retourne tous les documents via GET /documents.
// On filtre côté front sur ownerId === userId pour n'afficher que les siens.
export async function getAllDocuments(): Promise<IDocument[]> {
  const { data } = await api.get<IDocument[]>("/documents");
  return data;
}

// ─── AJOUTER UN DOCUMENT À UN GROUPE ────────────────────────────────────────
// C'est le cœur de LOC-153 — on appelle la route qu'on vient de créer côté back.
export type AddDocToGroupData = {
  docId: string;
  expirationDate?: string;
};

export async function addDocToGroup(
  groupId: string,
  data: AddDocToGroupData,
): Promise<void> {
  await api.post(`/groups/${groupId}/documents`, data);
}

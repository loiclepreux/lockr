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

// ─── UPLOADER UN DOCUMENT ───────────────────────────────────────────────────
export type UploadDocumentData = {
    file: File;
    name: string;
    typeId?: string;
};

export async function uploadDocument(
    data: UploadDocumentData,
): Promise<IDocument> {
    const formData = new FormData();

    formData.append("file", data.file);
    formData.append("name", data.name);

    if (data.typeId) {
        formData.append("typeId", data.typeId);
    }

    const response = await api.post<IDocument>("/documents", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

// ─── SUPPRIMER UN DOCUMENT ──────────────────────────────────────────────────
export async function deleteDocument(documentId: string): Promise<void> {
    await api.delete(`/documents/${documentId}`);
}

// ─── RENOMMER UN DOCUMENT ──────────────────────────────────────────────────
export async function renameDocument(
    documentId: string,
    name: string,
): Promise<IDocument> {
    const response = await api.patch<IDocument>(`/documents/${documentId}`, {
        name,
    });

    return response.data;
}

// ─── CHANGER LE STATUT D'UN DOCUMENT ────────────────────────────────────────
export async function updateDocumentStatus(
    documentId: string,
    status: string,
): Promise<IDocument> {
    const response = await api.patch<IDocument>(
        `/documents/${documentId}/status`,
        { status },
    );

    return response.data;
}

// ─── AJOUTER UN DOCUMENT À UN GROUPE ────────────────────────────────────────
// C'est le ticket LOC-153 — on appelle la route qu'on vient de créer côté back.
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

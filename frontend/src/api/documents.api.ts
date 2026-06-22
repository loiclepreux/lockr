import { api } from "../utils/axios-client";
import type { IDocument } from "../types/IDocument";

// ─── RÉCUPÉRER MES DOCUMENTS ────────────────────────────────────────────────
export type PaginatedDocuments = {
    data: IDocument[];
    meta: { total: number; page: number; limit: number; totalPages: number };
};

export async function getAllDocuments(
    page = 1,
    limit = 20,
): Promise<PaginatedDocuments> {
    const { data } = await api.get<PaginatedDocuments>("/documents", {
        params: { page, limit },
    });
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

    const extension = data.file.name.split(".").pop()?.toLowerCase() ?? "";

    formData.append("file", data.file);
    formData.append("name", data.name);
    formData.append("extension", extension);

    if (data.typeId) {
        formData.append("docTypeId", data.typeId);
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
export type DocumentStatus = "ACTIVE" | "ARCHIVED" | "DELETED";

export async function updateDocumentStatus(
    documentId: string,
    status: DocumentStatus,
): Promise<IDocument> {
    const response = await api.patch<IDocument>(
        `/documents/${documentId}/status`,
        { status },
    );

    return response.data;
}

// ─── CHANGER LA PRIORITÉ D'UN DOCUMENT ──────────────────────────────────────
export type DocumentPriority = "LOW" | "MEDIUM" | "HIGH";

export async function updateDocumentPriority(
    documentId: string,
    priority: DocumentPriority,
): Promise<IDocument> {
    const response = await api.patch<IDocument>(
        `/documents/${documentId}/priority`,
        { priority },
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

// ─── PARTAGER UN DOCUMENT AVEC UN UTILISATEUR ───────────────────────────────
export type ShareDocumentData = {
    receiverId: string;
    expirationDate?: string;
};

export async function shareDocument(
    documentId: string,
    data: ShareDocumentData,
): Promise<void> {
    await api.post(`/documents/${documentId}/share`, data);
}

export async function downloadDocument(documentId: string): Promise<void> {
    const response = await api.get(`/documents/${documentId}/download`, {
        responseType: "blob",
    });

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");

    link.href = url;
    link.download = "document";
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
}

import { api } from "../utils/axios-client";
import type { IDocument } from "../types/IDocument";

// ─── RÉCUPÉRER LES DOCUMENTS DANS LA CORBEILLE ──────────────────────────────
export async function getTrashDocuments(): Promise<IDocument[]> {
    const { data } = await api.get<IDocument[]>("/documents/trash");
    return data;
}

// ─── RESTAURER UN DOCUMENT ──────────────────────────────────────────────────
export async function restoreDocument(documentId: string): Promise<IDocument> {
    const { data } = await api.post<IDocument>(
        `/documents/${documentId}/restore`,
    );

    return data;
}

// ─── SUPPRIMER DÉFINITIVEMENT UN DOCUMENT ───────────────────────────────────
export async function permanentDeleteDocument(
    documentId: string,
): Promise<IDocument> {
    const { data } = await api.delete<IDocument>(
        `/documents/${documentId}/permanent`,
    );

    return data;
}

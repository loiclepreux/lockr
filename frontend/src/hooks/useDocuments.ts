import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllDocuments,
    addDocToGroup,
    updateDocumentStatus,
    updateDocumentPriority,
    shareDocument,
    type DocumentStatus,
    type ShareDocumentData,
    type DocumentPriority,
} from "../api/documents.api";
import type { AddDocToGroupData } from "../api/documents.api";
import { useAuthStore } from "../stores/useAuthStore";
import type { DocumentFile } from "../types/documentFiles";
import type { IDocument } from "../types/IDocument";
import {
    deleteDocument,
    renameDocument,
    uploadDocument,
    downloadDocument,
    type UploadDocumentData,
} from "../api/documents.api";

const mapPriorityToFrench = (
    priority?: DocumentPriority,
): DocumentFile["priority"] => {
    switch (priority) {
        case "HIGH":
            return "Haute";
        case "LOW":
            return "Basse";
        case "MEDIUM":
        default:
            return "Moyenne";
    }
};

// ─── MES DOCUMENTS ──────────────────────────────────────────────────────────
export const useMyDocuments = () => {
    const userId = useAuthStore((state) => state.user?.id);

    return useQuery({
        queryKey: ["documents", "mine", userId],
        queryFn: async () => {
            const allDocs = await getAllDocuments();
            return (
                allDocs
                    .filter((doc) => doc.ownerId === userId)
                    // On transforme IDocument → DocumentFile pour compatibilité avec l'UI existante
                    .map(
                        (doc): DocumentFile => ({
                            id: doc.id,
                            name: doc.name,
                            size: doc.size,
                            date: new Date(doc.addedDate).toLocaleDateString(
                                "fr-FR",
                            ),
                            type: doc.extension.toUpperCase(),
                            doctype: doc.extension.toUpperCase(),
                            priority: mapPriorityToFrench(doc.priority),
                        }),
                    )
            );
        },
        enabled: !!userId,
    });
};

// ─── UPLOADER UN DOCUMENT ───────────────────────────────────────────────────
export const useUploadDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UploadDocumentData) => uploadDocument(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
};

// ─── SUPPRIMER UN DOCUMENT ──────────────────────────────────────────────────
export const useDeleteDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentId: string) => deleteDocument(documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
};

// ─── RENOMMER UN DOCUMENT ───────────────────────────────────────────────────
export const useRenameDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            documentId,
            name,
        }: {
            documentId: string;
            name: string;
        }) => renameDocument(documentId, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
};

// ─── AJOUTER UN DOCUMENT À UN GROUPE ────────────────────────────────────────
export const useAddDocToGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            groupId,
            data,
        }: {
            groupId: string;
            data: AddDocToGroupData;
        }) => addDocToGroup(groupId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["groups"],
            });

            queryClient.invalidateQueries({
                queryKey: ["groups", variables.groupId, "documents"],
            });
        },
    });
};

// ─── CHANGER LE STATUT D'UN DOCUMENT ────────────────────────────────────────
export const useUpdateDocumentStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            documentId,
            status,
        }: {
            documentId: string;
            status: DocumentStatus;
        }) => updateDocumentStatus(documentId, status),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
};

// ─── CHANGER LA PRIORITÉ D'UN DOCUMENT ──────────────────────────────────────
export const useUpdateDocumentPriority = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            documentId,
            priority,
        }: {
            documentId: string;
            priority: DocumentPriority;
        }) => updateDocumentPriority(documentId, priority),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
};

// ─── PARTAGER UN DOCUMENT AVEC UN UTILISATEUR ───────────────────────────────
export const useShareDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            documentId,
            data,
        }: {
            documentId: string;
            data: ShareDocumentData;
        }) => shareDocument(documentId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
};

// ─── DOCUMENTS BRUTS POUR LES SELECTS ───────────────────────────────────────
export const useRawDocuments = () => {
    return useQuery<IDocument[]>({
        queryKey: ["documents", "raw"],
        queryFn: getAllDocuments,
    });
};

export const useDownloadDocument = () => {
    return useMutation({
        mutationFn: (documentId: string) => downloadDocument(documentId),
    });
};

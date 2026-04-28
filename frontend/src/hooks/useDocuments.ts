// src/hooks/useDocuments.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllDocuments, addDocToGroup } from "../api/documents.api";
import type { AddDocToGroupData } from "../api/documents.api";
import { useAuthStore } from "../stores/useAuthStore";
import type { DocumentFile } from "../types/documentFiles";
import {
    deleteDocument,
    renameDocument,
    uploadDocument,
    type UploadDocumentData,
} from "../api/documents.api";

// ─── MES DOCUMENTS ──────────────────────────────────────────────────────────
// On récupère tous les documents et on filtre ceux dont je suis le propriétaire.
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
                            doctype: "", // LOC-152 — champ non présent dans IDocument
                            priority: "Moyenne", // LOC-152 — champ non présent dans IDocument
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
        onSuccess: () => {
            // On invalide les groupes pour que la liste se rafraîchisse
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });
};

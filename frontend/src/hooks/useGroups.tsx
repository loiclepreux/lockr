import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllGroups,
    createGroup,
    deleteGroup,
    addMember,
    getGroupById,
    getGroupDocuments,
    removeDocFromGroup,
    removeMember,
} from "../api/groups.api";
import type { AddMemberData } from "../api/groups.api";
import { useAuthStore } from "../stores/useAuthStore";

// ─── MES GROUPES ────────────────────────────────────────────────────────────
export const useMyGroups = () => {
    const userId = useAuthStore((state) => state.user?.id);

    return useQuery({
        queryKey: ["groups", "mine", userId],
        queryFn: async () => {
            const allGroups = await getAllGroups();
            return allGroups.filter((g) => g.creatorId === userId);
        },
        enabled: !!userId,
    });
};

// ─── GROUPES PARTAGÉS ───────────────────────────────────────────────────────
export const useSharedGroups = () => {
    const userId = useAuthStore((state) => state.user?.id);

    return useQuery({
        queryKey: ["groups", "shared", userId],
        queryFn: async () => {
            const allGroups = await getAllGroups();
            return allGroups.filter(
                (g) =>
                    g.creatorId !== userId &&
                    g.users.some((m) => m.userId === userId),
            );
        },
        enabled: !!userId,
    });
};

// ─── CRÉER UN GROUPE ────────────────────────────────────────────────────────
export const useCreateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });
};

// ─── SUPPRIMER UN GROUPE ────────────────────────────────────────────────────
export const useDeleteGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });
};

// ─── AJOUTER UN MEMBRE ──────────────────────────────────────────────────────
export const useAddMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            groupId,
            member,
        }: {
            groupId: string;
            member: AddMemberData;
        }) => addMember(groupId, member),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });
};

// ─── RÉCUPÉRER UN GROUPE ───────────────────────────────────────────────────
export const useGroupById = (groupId: string | null) => {
    return useQuery({
        queryKey: ["groups", groupId],
        queryFn: () => getGroupById(groupId as string),
        enabled: !!groupId,
    });
};

// ─── RÉCUPÉRER LES DOCUMENTS D'UN GROUPE ───────────────────────────────────
export const useGroupDocuments = (groupId: string | null) => {
    return useQuery({
        queryKey: ["groups", groupId, "documents"],
        queryFn: () => getGroupDocuments(groupId as string),
        enabled: !!groupId,
    });
};

// ─── RETIRER UN DOCUMENT D'UN GROUPE ───────────────────────────────────────
export const useRemoveDocFromGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ groupId, docId }: { groupId: string; docId: string }) =>
            removeDocFromGroup(groupId, docId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["groups", variables.groupId, "documents"],
            });
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });
};

// ─── RETIRER UN MEMBRE ─────────────────────────────────────────────────────
export const useRemoveMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            groupId,
            userId,
        }: {
            groupId: string;
            userId: string;
        }) => removeMember(groupId, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["groups", variables.groupId],
            });
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });
};

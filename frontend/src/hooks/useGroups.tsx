// src/hooks/useGroups.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllGroups,
    createGroup,
    deleteGroup,
    addMember,
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

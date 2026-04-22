// src/hooks/useGroups.ts
// Hooks TanStack Query pour les groupes — LOC-189
// Ces hooks font le pont entre les fonctions API et les composants React.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createGroup,
    deleteGroup,
    getMyGroups,
    getSharedGroups,
} from "../api/groups.api";
//       ↑ On importe les fonctions du fichier API (le maillon précédent)

// ─── LIRE MES GROUPES ──────────────────────────────────
export const useMyGroups = () => {
    return useQuery({
        queryKey: ["groups", "mine"], // L'étiquette dans le cache
        queryFn: getMyGroups, // La fonction API à appeler
    });
};

// ─── LIRE LES GROUPES PARTAGÉS ─────────────────────────
export const useSharedGroups = () => {
    return useQuery({
        queryKey: ["groups", "shared"],
        queryFn: getSharedGroups,
    });
};

// ─── CRÉER UN GROUPE ────────────────────────────────────
export const useCreateGroup = () => {
    const queryClient = useQueryClient(); // Le manager qui gère tout le cache

    return useMutation({
        mutationFn: createGroup,
        onSuccess: () => {
            // "Les groupes ont changé, tout le monde rafraîchit !"
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });
};

// ─── SUPPRIMER UN GROUPE ────────────────────────────────
export const useDeleteGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });
};

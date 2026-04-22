// src/types/IHistory.ts

export type HistoryAction =
    | "create"
    | "update"
    | "delete"
    | "share"
    | "download";

export interface IHistory {
    id: string;
    groupId: string; // 👈 à quel groupe appartient cet événement
    action: HistoryAction;
    targetName: string; // le nom de l'élément concerné
    performedBy: string; // prénom + nom de l'auteur
    createdAt: string; // date ISO
}

import { api } from "../utils/axios-client";
import type { IGroup, CreateGroupData } from "../types/IGroup";

// ─── RÉCUPÉRER TOUS LES GROUPES ────────────────────────────────────────────
// Le back retourne tous les groupes. On expose cette fonction brute,
// et c'est le hook qui se chargera de filtrer "mine" vs "shared".
export async function getAllGroups(): Promise<IGroup[]> {
    const { data } = await api.get<IGroup[]>("/groups");
    return data;
}

// ─── CRÉER UN GROUPE ────────────────────────────────────────────────────────
// On envoie uniquement les champs du CreateGroupDto — plus de membres ici.
// Les membres s'ajoutent en deux temps via addMember() après création.
export async function createGroup(group: CreateGroupData): Promise<IGroup> {
    const { data } = await api.post<IGroup>("/groups", group);
    return data;
}

// ─── SUPPRIMER UN GROUPE ────────────────────────────────────────────────────
export async function deleteGroup(id: string): Promise<void> {
    await api.delete(`/groups/${id}`);
}

// ─── AJOUTER UN MEMBRE ──────────────────────────────────────────────────────
// Appelé après la création du groupe pour ajouter les membres un par un.
export type AddMemberData = {
    userId: string;
    role: "creator" | "moderator" | "user";
};

export async function addMember(
    groupId: string,
    member: AddMemberData,
): Promise<void> {
    await api.post(`/groups/${groupId}/members`, member);
}

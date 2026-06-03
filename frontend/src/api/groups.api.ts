import { api } from "../utils/axios-client";
import type { IGroup, CreateGroupData } from "../types/IGroup";

// ─── RÉCUPÉRER TOUS LES GROUPES ────────────────────────────────────────────
export async function getAllGroups(): Promise<IGroup[]> {
    const { data } = await api.get<IGroup[]>("/groups");
    return data;
}

// ─── CRÉER UN GROUPE ────────────────────────────────────────────────────────
export async function createGroup(group: CreateGroupData): Promise<IGroup> {
    const { data } = await api.post<IGroup>("/groups", group);
    return data;
}

// ─── SUPPRIMER UN GROUPE ────────────────────────────────────────────────────
export async function deleteGroup(id: string): Promise<void> {
    await api.delete(`/groups/${id}`);
}

// ─── AJOUTER UN MEMBRE ──────────────────────────────────────────────────────
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

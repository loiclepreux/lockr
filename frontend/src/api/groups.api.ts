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

// ─── RÉCUPÉRER UN GROUPE ───────────────────────────────────────────────────
export async function getGroupById(groupId: string): Promise<IGroup> {
    const { data } = await api.get<IGroup>(`/groups/${groupId}`);
    return data;
}

// ─── RÉCUPÉRER LES DOCUMENTS D'UN GROUPE ───────────────────────────────────
export async function getGroupDocuments(groupId: string) {
    const { data } = await api.get(`/groups/${groupId}/documents`);
    return data;
}

// ─── RETIRER UN DOCUMENT D'UN GROUPE ───────────────────────────────────────
export async function removeDocFromGroup(
    groupId: string,
    docId: string,
): Promise<void> {
    await api.delete(`/groups/${groupId}/documents/${docId}`);
}

// ─── RETIRER UN MEMBRE ─────────────────────────────────────────────────────
export async function removeMember(
    groupId: string,
    userId: string,
): Promise<void> {
    await api.delete(`/groups/${groupId}/members/${userId}`);
}

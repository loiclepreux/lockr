// src/api/history.api.ts

import type { IHistory } from "../types/IHistory";

// const API_URL = "http://localhost:3000/api";

const fakeHistory: IHistory[] = [
    { id: "h1", groupId: "1", action: "create",  targetName: "Projet S6",        performedBy: "Wesley Martin", createdAt: "2026-04-14T09:00:00Z" },
    { id: "h2", groupId: "1", action: "share",   targetName: "Rapport final.pdf", performedBy: "Alice Dupont",  createdAt: "2026-04-13T14:30:00Z" },
    { id: "h3", groupId: "1", action: "delete",  targetName: "Brouillon v1.docx", performedBy: "Wesley Martin", createdAt: "2026-04-13T11:00:00Z" },
    { id: "h4", groupId: "2", action: "update",  targetName: "Lockr Team",        performedBy: "Clara Petit",   createdAt: "2026-04-12T16:45:00Z" },
    { id: "h5", groupId: "2", action: "create",  targetName: "Specs API.pdf",     performedBy: "Alice Dupont",  createdAt: "2026-04-12T10:00:00Z" },
    { id: "h6", groupId: "1", action: "share",   targetName: "Maquette UI.fig",   performedBy: "Wesley Martin", createdAt: "2026-04-11T09:15:00Z" },
    { id: "h7", groupId: "2", action: "delete",  targetName: "Bob Dupont",        performedBy: "Clara Petit",   createdAt: "2026-04-10T17:00:00Z" },
    { id: "h8", groupId: "1", action: "create",  targetName: "Design UI",         performedBy: "Wesley Martin", createdAt: "2026-04-09T08:30:00Z" },
];

// On filtre par groupId — quand le backend sera branché,
// ce sera un paramètre de query : GET /groups/:id/history
export async function getGroupHistory(groupId: string): Promise<IHistory[]> {
    // const { data } = await api.get<IHistory[]>(`${API_URL}/groups/${groupId}/history`);
    // return data;

    return fakeHistory.filter((entry) => entry.groupId === groupId);
}
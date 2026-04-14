// on décommentera les lignes axios et on supprimera le fake

import type { IGroup } from "../types/IGroup";

const API_URL = "http://localhost:3000/api";

// ─── RÉCUPÉRER MES GROUPES ─────────────────────────────
export async function getMyGroups(): Promise<IGroup[]> {
    // const { data } = await axios.get<IGroup[]>(`${API_URL}/groups/mine`);
    // return data;

    const data: IGroup[] = [
        { id: 1, name: "Projet S6", description: "Groupe de travail S6", membersCount: 5 },
        { id: 2, name: "Lockr Team", description: "Équipe de développement", membersCount: 3 },
        { id: 3, name: "Design UI", description: "Maquettes et wireframes", membersCount: 4 }
    ];
    return data;
}

// ─── RÉCUPÉRER LES GROUPES PARTAGÉS ────────────────────
export async function getSharedGroups(): Promise<IGroup[]> {
    // const { data } = await axios.get<IGroup[]>(`${API_URL}/groups/shared`);
    // return data;

    const data: IGroup[] = [
        { id: 4, name: "Backend API", description: "Groupe partagé backend", membersCount: 6 },
        { id: 5, name: "Dev Frontend", description: "Groupe partagé frontend", membersCount: 8 }
    ];
    return data;
}

// ─── CRÉER UN GROUPE ────────────────────────────────────
export async function createGroup(group: Omit<IGroup, "id">): Promise<IGroup> {
    // const { data } = await axios.post<IGroup>(`${API_URL}/groups`, group);
    // return data;

    const data: IGroup = {
        ...group,
        id: Date.now()
    };
    return data;
}

// ─── SUPPRIMER UN GROUPE ────────────────────────────────
export async function deleteGroup(id: number): Promise<void> {
    // await axios.delete(`${API_URL}/groups/${id}`);

    console.log(`Fake delete group ${id}`);
}

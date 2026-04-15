// src/api/groups.api.ts
// on décommentera les lignes axios et on supprimera le fake

import type { IGroup, CreateGroupData } from "../types/IGroup";

//const API_URL = "http://localhost:3000/api";

// Ce tableau vit en mémoire le temps que la page est ouverte.
// Il remplace le tableau en dur — c'est notre "base de données" temporaire pour les tests.
let fakeMyGroups: IGroup[] = [
    {
        id: "1",
        name: "Projet S6",
        description: "Groupe de travail S6",
        membersCount: 2,
        members: [
            {
                id: "m1",
                firstName: "Alice",
                lastName: "Martin",
                email: "alice@lockr.fr",
            },
            {
                id: "m2",
                firstName: "Bob",
                lastName: "Dupont",
                email: "bob@lockr.fr",
            },
        ],
    },
    {
        id: "2",
        name: "Lockr Team",
        description: "Équipe de développement",
        membersCount: 1,
        members: [
            {
                id: "m3",
                firstName: "Clara",
                lastName: "Petit",
                email: "clara@lockr.fr",
            },
        ],
    },
];

// ─── RÉCUPÉRER MES GROUPES ─────────────────────────────
export async function getMyGroups(): Promise<IGroup[]> {
    // const { data } = await axios.get<IGroup[]>(`${API_URL}/groups/mine`);
    // return data;

    return fakeMyGroups; // on lit le tableau en mémoire au lieu du tableau en dur
}

// ─── RÉCUPÉRER LES GROUPES PARTAGÉS ────────────────────
export async function getSharedGroups(): Promise<IGroup[]> {
    // const { data } = await axios.get<IGroup[]>(`${API_URL}/groups/shared`);
    // return data;

    return [
        {
            id: "4",
            name: "Backend API",
            description: "Groupe partagé backend",
            membersCount: 0,
            members: [],
        },
        {
            id: "5",
            name: "Dev Frontend",
            description: "Groupe partagé frontend",
            membersCount: 0,
            members: [],
        },
    ];
}

// ─── CRÉER UN GROUPE ────────────────────────────────────
export async function createGroup(group: CreateGroupData): Promise<IGroup> {
    // const { data } = await axios.post<IGroup>(`${API_URL}/groups`, group);
    // return data;

    const newGroup: IGroup = {
        ...group,
        id: crypto.randomUUID(),
        membersCount: group.members.length,
        members: group.members.map((m) => ({ ...m, id: crypto.randomUUID() })),
    };

    fakeMyGroups = [...fakeMyGroups, newGroup]; // on l'ajoute en mémoire
    return newGroup;
}

// ─── SUPPRIMER UN GROUPE ────────────────────────────────
export async function deleteGroup(id: string): Promise<void> {
    // await axios.delete(`${API_URL}/groups/${id}`);

    console.log(`Fake delete group ${id}`);
}

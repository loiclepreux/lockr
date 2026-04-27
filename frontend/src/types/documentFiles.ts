export interface DocumentFile {
    id: string; // 👈 string au lieu de number
    name: string;
    size: string;
    date: string;
    type: string;
    doctype: string;
    priority: "Haute" | "Moyenne" | "Basse";
}

export interface AccessGroup {
    id: string;
    name: string;
}

export interface AccessUser {
    email: string;
    initials: string;
    expiry: string | null;
}

export const mockGroups: AccessGroup[] = [
    {
        id: "1",
        name: "Equipe Front",
    },
    {
        id: "2",
        name: "Equipe Back",
    },
    {
        id: "3",
        name: "Projet CNP",
    },
];

export const mockUsers: AccessUser[] = [
    {
        email: "jean.dupont@lockr.fr",
        initials: "JD",
        expiry: "12 jours",
    },
    {
        email: "sarah.martin@outlook.fr",
        initials: "SM",
        expiry: null,
    },
];

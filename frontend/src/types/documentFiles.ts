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

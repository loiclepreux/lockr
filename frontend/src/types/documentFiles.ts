export interface DocumentFile {
    id: number;
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

export const mockDocuments: DocumentFile[] = [
    {
        id: 1,
        name: "Contrat_Location_Appartement_Paris_2026_Final_Signe.pdf",
        size: "1.2 MB",
        date: "Il y a 2h",
        type: "PDF",
        doctype: "administratif",
        priority: "Haute",
    },
    {
        id: 2,
        name: "Photo_Identite_Officielle_Fond_Blanc.png",
        size: "4.5 MB",
        date: "Hier",
        type: "IMG",
        doctype: "juridique",
        priority: "Basse",
    },
    {
        id: 3,
        name: "Note_Frais_Mars_2026_Deplacement_Lyon.xlsx",
        size: "850 KB",
        date: "Aujourd'hui",
        type: "XLS",
        doctype: "economique",
        priority: "Basse",
    },
    {
        id: 4,
        name: "Scan_Passeport_Recto_Verso_HD.jpg",
        size: "2.1 MB",
        date: "Il y a 3 jours",
        type: "IMG",
        doctype: "personnel",
        priority: "Moyenne",
    },
    {
        id: 5,
        name: "Presentation_Projet_Lockr_vFinal_v2_Equipe_Dev.pptx",
        size: "15.4 MB",
        date: "10 Mars 2026",
        type: "PPT",
        doctype: "academique",
        priority: "Haute",
    },
    {
        id: 6,
        name: "Script_Migration_Database_Prod_v1.sql",
        size: "12 KB",
        date: "Il y a 1h",
        type: "TXT",
        doctype: "administratif",
        priority: "Moyenne",
    },
    {
        id: 7,
        name: "Video_Demo_Interface_Utilisateur_Dashboard.mp4",
        size: "142.8 MB",
        date: "Hier",
        type: "MOV",
        doctype: "juridique",
        priority: "Haute",
    },
    {
        id: 8,
        name: "CV_Developpeur_Fullstack_React_Tailwind.pdf",
        size: "450 KB",
        date: "Il y a 5 jours",
        type: "PDF",
        doctype: "economique",
        priority: "Moyenne",
    },
    {
        id: 9,
        name: "Archives_Backup_Janvier_2025.zip",
        size: "2.4 GB",
        date: "01 Janv 2026",
        type: "ZIP",
        doctype: "academique",
        priority: "Basse",
    },
    {
        id: 10,
        name: "Logo_Lockr_Vectoriel_Couleur_Originale.svg",
        size: "15 KB",
        date: "Hier",
        type: "SVG",
        doctype: "personnel",
        priority: "Haute",
    },
];

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

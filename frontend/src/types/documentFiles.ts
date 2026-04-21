export interface DocumentFile {
    id: number;
    name: string;
    size: string;
    date: string;
    type: string;
    status: "En attente" | "Partagé" | "Archivé" | "Validé" | "Refusé";
    priority: "Haute" | "Moyenne" | "Basse";
}

export interface AccessGroup {
    id: string;
    name: string;
    expiry: string | null;
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
        status: "En attente",
        priority: "Haute",
    },
    {
        id: 2,
        name: "Photo_Identite_Officielle_Fond_Blanc.png",
        size: "4.5 MB",
        date: "Hier",
        type: "IMG",
        status: "Validé",
        priority: "Basse",
    },
    {
        id: 3,
        name: "Note_Frais_Mars_2026_Deplacement_Lyon.xlsx",
        size: "850 KB",
        date: "Aujourd'hui",
        type: "XLS",
        status: "Refusé",
        priority: "Basse",
    },
    {
        id: 4,
        name: "Scan_Passeport_Recto_Verso_HD.jpg",
        size: "2.1 MB",
        date: "Il y a 3 jours",
        type: "IMG",
        status: "Archivé",
        priority: "Moyenne",
    },
    {
        id: 5,
        name: "Presentation_Projet_Lockr_vFinal_v2_Equipe_Dev.pptx",
        size: "15.4 MB",
        date: "10 Mars 2026",
        type: "PPT",
        status: "Partagé",
        priority: "Haute",
    },
    {
        id: 6,
        name: "Script_Migration_Database_Prod_v1.sql",
        size: "12 KB",
        date: "Il y a 1h",
        type: "TXT",
        status: "En attente",
        priority: "Moyenne",
    },
    {
        id: 7,
        name: "Video_Demo_Interface_Utilisateur_Dashboard.mp4",
        size: "142.8 MB",
        date: "Hier",
        type: "MOV",
        status: "Validé",
        priority: "Haute",
    },
    {
        id: 8,
        name: "CV_Developpeur_Fullstack_React_Tailwind.pdf",
        size: "450 KB",
        date: "Il y a 5 jours",
        type: "PDF",
        status: "Partagé",
        priority: "Moyenne",
    },
    {
        id: 9,
        name: "Archives_Backup_Janvier_2025.zip",
        size: "2.4 GB",
        date: "01 Janv 2026",
        type: "ZIP",
        status: "En attente",
        priority: "Basse",
    },
    {
        id: 10,
        name: "Logo_Lockr_Vectoriel_Couleur_Originale.svg",
        size: "15 KB",
        date: "Hier",
        type: "SVG",
        status: "Refusé",
        priority: "Haute",
    },
];

export const mockGroups: AccessGroup[] = [
    {
        id: "1",
        name: "Equipe Front",
        expiry: "7 jours",
    },
    {
        id: "2",
        name: "Equipe Back",
        expiry: null,
    },
    {
        id: "3",
        name: "Projet CNP",
        expiry: null,
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

export interface DocumentFile {
    id: number;
    name: string;
    size: string;
    date: string;
    type: string;
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
        },
        {
            id: 2,
            name: "Photo_Identite_Officielle_Fond_Blanc.png",
            size: "4.5 MB",
            date: "Hier",
            type: "IMG",
        },
        {
            id: 3,
            name: "Note_Frais_Mars_2026_Deplacement_Lyon.xlsx",
            size: "850 KB",
            date: "Aujourd'hui",
            type: "XLS",
        },
        {
            id: 4,
            name: "Scan_Passeport_Recto_Verso_HD.jpg",
            size: "2.1 MB",
            date: "Il y a 3 jours",
            type: "IMG",
        },
        {
            id: 5,
            name: "Presentation_Projet_Lockr_vFinal_v2_Equipe_Dev.pptx",
            size: "15.4 MB",
            date: "10 Mars 2026",
            type: "PPT",
        },
        {
            id: 6,
            name: "Script_Migration_Database_Prod_v1.sql",
            size: "12 KB",
            date: "Il y a 1h",
            type: "TXT",
        },
        {
            id: 7,
            name: "Video_Demo_Interface_Utilisateur_Dashboard.mp4",
            size: "142.8 MB",
            date: "Hier",
            type: "MOV",
        },
        {
            id: 8,
            name: "CV_Developpeur_Fullstack_React_Tailwind.pdf",
            size: "450 KB",
            date: "Il y a 5 jours",
            type: "PDF",
        },
        {
            id: 9,
            name: "Archives_Backup_Janvier_2025.zip",
            size: "2.4 GB",
            date: "01 Janv 2026",
            type: "ZIP",
        },
        {
            id: 10,
            name: "Logo_Lockr_Vectoriel_Couleur_Originale.svg",
            size: "15 KB",
            date: "Hier",
            type: "SVG",
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
            name: "Admins Lockr",
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
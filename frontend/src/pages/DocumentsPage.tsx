import { useEffect, useRef, useState } from "react";
import { Download, Edit2, MoreVertical, Share2, Trash2 } from "lucide-react";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import { feedbackMessages } from "../types/feedbackMessage";
import { ShareModal } from "../components/modal/ShareModal";
import { DeleteModal } from "../components/modal/DeleteModal";
import { RenameModal } from "../components/modal/RenameModal";

interface DocumentFile {
    id: number;
    name: string;
    size: string;
    date: string;
    type: string;
}

interface AccessUser {
    email: string;
    initials: string;
    expiry: string | null;
}

const MOCK_USERS = [
    "alexandre.dubois@gmail.com",
    "sarah.martin@outlook.fr",
    "thomas.legrand@lockr.io",
    "julie.vignaud@yahoo.com",
    "kevin.durant@gmail.com",
    "sophie.bernadotte@gmail.com",
];

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<DocumentFile[]>([
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
    ]);

    const [selectedDoc, setSelectedDoc] = useState<DocumentFile | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const [newName, setNewName] = useState("");
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const [emailInput, setEmailInput] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<string[]>([]);
    const [existingAccess, setExistingAccess] = useState<AccessUser[]>([
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
    ]);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (emailInput.trim().length > 0) {
            const filtered = MOCK_USERS.filter(
                (user) =>
                    user.toLowerCase().includes(emailInput.toLowerCase()) &&
                    !selectedUsers.includes(user),
            );
            setSuggestedUsers(filtered);
        } else {
            setSuggestedUsers([]);
        }
    }, [emailInput, selectedUsers]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setOpenMenuId(null);
            }
        };

        if (openMenuId !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openMenuId]);

    useEffect(() => {
        if (!feedback) return;

        const timeout = setTimeout(() => {
            setFeedback(null);
        }, 3000);

        return () => clearTimeout(timeout);
    }, [feedback]);

    const getTypeClasses = (type: string) => {
        switch (type) {
            case "PDF":
                return "bg-red-500/10 text-red-400 border border-red-500/20";
            case "IMG":
            case "SVG":
                return "bg-violet-500/10 text-violet-400 border border-violet-500/20";
            case "DOC":
            case "TXT":
            case "CONF":
            case "XML":
                return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
            case "XLS":
            case "CSV":
                return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
            case "PPT":
                return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
            case "ZIP":
                return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
            case "MP3":
            case "MOV":
                return "bg-pink-500/10 text-pink-400 border border-pink-500/20";
            default:
                return "bg-slate-500/10 text-slate-300 border border-slate-500/20";
        }
    };

    const openDialog = (id: string) => {
        const modal = document.getElementById(id) as HTMLDialogElement | null;
        if (modal) modal.showModal();
    };

    const closeDialog = (id: string) => {
        const modal = document.getElementById(id) as HTMLDialogElement | null;
        if (modal) modal.close();
    };

    const handleMenuToggle = (
        doc: DocumentFile,
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        if (openMenuId === doc.id) {
            setOpenMenuId(null);
            return;
        }

        const btnRect = e.currentTarget.getBoundingClientRect();
        const menuWidth = 224;
        const menuHeight = 180;
        const padding = 8;

        let left = btnRect.right - menuWidth;
        let top = btnRect.bottom + 6;

        if (left < padding) left = padding;
        if (left + menuWidth > window.innerWidth - padding) {
            left = window.innerWidth - menuWidth - padding;
        }

        if (top + menuHeight > window.innerHeight - padding) {
            top = btnRect.top - menuHeight - 6;
        }

        if (top < padding) top = padding;

        setMenuPosition({ top, left });
        setOpenMenuId(doc.id);
    };

    const handleDeleteClick = (doc: DocumentFile) => {
        setSelectedDoc(doc);
        setOpenMenuId(null);
        openDialog("delete_modal");
    };

    const handleRenameClick = (doc: DocumentFile) => {
        setSelectedDoc(doc);
        setNewName(doc.name);
        setOpenMenuId(null);
        openDialog("rename_modal");
    };

    const handleShareClick = (doc: DocumentFile) => {
        setSelectedDoc(doc);
        setOpenMenuId(null);
        setSelectedUsers([]);
        setEmailInput("");
        openDialog("share_modal");
    };

    const confirmDelete = () => {
        if (!selectedDoc) {
            setFeedback({
                type: "error",
                message: feedbackMessages.document.deleteSelected,
            });
            return;
        }

        setDocuments((prev) => prev.filter((doc) => doc.id !== selectedDoc.id));

        setFeedback({
            type: "success",
            message: feedbackMessages.document.deleteSuccess,
        });

        closeDialog("delete_modal");
    };

    const confirmRename = () => {
        if (!selectedDoc) {
            setFeedback({
                type: "error",
                message: feedbackMessages.document.renameSelected,
            });
            return;
        }

        if (newName.trim() === "") {
            setFeedback({
                type: "error",
                message: feedbackMessages.document.emptyName,
            });
            return;
        }

        setDocuments((prev) =>
            prev.map((doc) =>
                doc.id === selectedDoc.id ? { ...doc, name: newName } : doc,
            ),
        );

        setFeedback({
            type: "success",
            message: feedbackMessages.document.renameSuccess,
        });

        closeDialog("rename_modal");
    };

    const confirmShare = () => {
        if (!selectedDoc) {
            setFeedback({
                type: "error",
                message: feedbackMessages.document.shareSelected,
            });
            return;
        }

        if (selectedUsers.length === 0) {
            setFeedback({
                type: "error",
                message: feedbackMessages.document.shareUsers,
            });
            return;
        }

        setFeedback({
            type: "success",
            message: feedbackMessages.document.shareSuccess,
        });

        closeDialog("share_modal");
    };

    const handleDownload = () => {
        const doc = documents.find((d) => d.id === openMenuId);

        if (!doc) {
            setFeedback({
                type: "error",
                message: feedbackMessages.document.downloadError,
            });
            return;
        }

        setFeedback({
            type: "success",
            message: feedbackMessages.document.downloadSuccess,
        });

        setOpenMenuId(null);
    };

    const addUser = (user: string) => {
        setSelectedUsers((prev) => [...prev, user]);
        setEmailInput("");
    };

    const removeUser = (user: string) => {
        setSelectedUsers((prev) => prev.filter((u) => u !== user));
    };

    return (
        <main className="min-w-0 bg-[#0b0f14] text-white">
            <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-3xl font-bold tracking-wide sm:text-4xl">
                        Mes <span className="text-cyan-400">documents</span>
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        {documents.length} fichiers sécurisés dans votre espace
                        Lockr
                    </p>
                </div>

                {feedback && (
                    <div className="mb-4">
                        <FeedbackMessage
                            type={feedback.type}
                            message={feedback.message}
                        />
                    </div>
                )}

                {/* MOBILE */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="rounded-2xl border border-cyan-500/10 bg-[#111318] p-4 shadow-[0_0_30px_rgba(0,255,255,0.03)]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <div
                                        className={`inline-flex rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getTypeClasses(
                                            doc.type,
                                        )}`}
                                    >
                                        {doc.type}
                                    </div>

                                    <p className="mt-3 break-words text-sm font-medium text-white">
                                        {doc.name}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="shrink-0 rounded-lg p-2 text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
                                    onClick={(e) => handleMenuToggle(doc, e)}
                                >
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-400">
                                <span>{doc.size}</span>
                                <span>•</span>
                                <span>{doc.date}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* DESKTOP / TABLET */}
                <div className="hidden md:block rounded-2xl border border-cyan-500/10 bg-[#111318] shadow-[0_0_40px_rgba(0,255,255,0.03)]">
                    <div className="overflow-x-auto rounded-2xl">
                        <table className="w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-[#0f1115] border-b border-white/5">
                                <tr className="text-xs uppercase tracking-[0.18em] text-gray-400">
                                    <th className="px-4 py-4 text-left font-semibold lg:px-6 lg:py-5">
                                        Nom
                                    </th>
                                    <th className="px-4 py-4 text-left font-semibold lg:px-6 lg:py-5">
                                        Taille
                                    </th>
                                    <th className="px-4 py-4 text-center font-semibold lg:px-6 lg:py-5">
                                        Date d'ajout
                                    </th>
                                    <th className="px-4 py-4 text-right font-semibold lg:px-6 lg:py-5 lg:pr-8">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {documents.map((doc) => (
                                    <tr
                                        key={doc.id}
                                        className="hover:bg-cyan-500/5 transition-all duration-200"
                                    >
                                        <td className="border-b border-white/5 px-4 py-4 lg:px-6 lg:py-5">
                                            <div className="flex min-w-0 items-center gap-3 lg:gap-4">
                                                <div
                                                    className={`shrink-0 rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getTypeClasses(
                                                        doc.type,
                                                    )}`}
                                                >
                                                    {doc.type}
                                                </div>

                                                <span className="max-w-[220px] truncate font-medium text-white lg:max-w-[420px]">
                                                    {doc.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="border-b border-white/5 px-4 py-4 text-gray-400 lg:px-6 lg:py-5">
                                            {doc.size}
                                        </td>

                                        <td className="border-b border-white/5 px-4 py-4 text-center text-gray-400 lg:px-6 lg:py-5">
                                            {doc.date}
                                        </td>

                                        <td className="border-b border-white/5 px-4 py-4 text-right lg:px-6 lg:py-5 lg:pr-8">
                                            <button
                                                type="button"
                                                className="rounded-lg p-2 text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
                                                onClick={(e) =>
                                                    handleMenuToggle(doc, e)
                                                }
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {openMenuId !== null && (
                <div
                    ref={menuRef}
                    className="fixed z-50 w-56 overflow-hidden rounded-2xl border border-cyan-500/10 bg-[#111318] shadow-[0_10px_35px_rgba(0,0,0,0.45)] backdrop-blur-sm"
                    style={{
                        top: menuPosition.top,
                        left: menuPosition.left,
                    }}
                >
                    <ul className="py-2">
                        <li>
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="w-full px-4 py-3 text-left text-sm text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
                            >
                                <span className="flex items-center gap-3">
                                    <Download
                                        size={16}
                                        className="text-cyan-400"
                                    />
                                    <span>Télécharger</span>
                                </span>
                            </button>
                        </li>

                        <li>
                            <button
                                type="button"
                                onClick={() => {
                                    const doc = documents.find(
                                        (d) => d.id === openMenuId,
                                    );
                                    if (doc) handleShareClick(doc);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
                            >
                                <span className="flex items-center gap-3">
                                    <Share2
                                        size={16}
                                        className="text-emerald-400"
                                    />
                                    <span>Partager</span>
                                </span>
                            </button>
                        </li>

                        <li>
                            <button
                                type="button"
                                onClick={() => {
                                    const doc = documents.find(
                                        (d) => d.id === openMenuId,
                                    );
                                    if (doc) handleRenameClick(doc);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
                            >
                                <span className="flex items-center gap-3">
                                    <Edit2
                                        size={16}
                                        className="text-cyan-400"
                                    />
                                    <span>Renommer</span>
                                </span>
                            </button>
                        </li>

                        <div className="mx-4 h-px bg-white/5" />

                        <li>
                            <button
                                type="button"
                                onClick={() => {
                                    const doc = documents.find(
                                        (d) => d.id === openMenuId,
                                    );
                                    if (doc) handleDeleteClick(doc);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                            >
                                <span className="flex items-center gap-3">
                                    <Trash2 size={16} />
                                    <span>Supprimer</span>
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
            {/* MODAL SHARE */}
            <ShareModal
                state={{
                    selectedDoc,
                    feedback,
                    selectedUsers,
                    emailInput,
                    suggestedUsers,
                    existingAccess,
                }}
                actions={{
                    setEmailInput,
                    setExistingAccess,
                    removeUser,
                    addUser,
                    confirmShare,
                }}
            />
            ;{/* MODAL DELETE */}
            <DeleteModal
                selectedDoc={selectedDoc}
                confirmDelete={confirmDelete}
            />
            {/* MODAL RENAME */}
            <RenameModal
                selectedDoc={selectedDoc}
                newName={newName}
                setNewName={setNewName}
                confirmRename={confirmRename}
            />
        </main>
    );
}

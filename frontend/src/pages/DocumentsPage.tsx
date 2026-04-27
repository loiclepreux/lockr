import { useAddDocToGroup } from "../hooks/useDocuments";
import { useMyGroups } from "../hooks/useGroups";
import { useEffect, useRef, useState } from "react";
import { Download, Edit2, Share2, Trash2 } from "lucide-react";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import { feedbackMessages } from "../types/feedbackMessage";
import { ShareModal } from "../components/documents/ShareModal";
import { UploadModal } from "../components/documents/UploadModal";
import { DeleteModal } from "../components/documents/DeleteModal";
import { RenameModal } from "../components/documents/RenameModal";
import { DocumentMobile } from "../components/documents/MobileDocument";
import { DocumentDesktop } from "../components/documents/DesktopDocument";
import { mockGroups, mockUsers } from "../types/documentFiles";
import { useMyDocuments } from "../hooks/useDocuments";

import type {
    DocumentFile,
    AccessGroup,
    AccessUser,
} from "../types/documentFiles";

const MOCK_USERS = [
    "alexandre.dubois@gmail.com",
    "sarah.martin@outlook.fr",
    "thomas.legrand@lockr.io",
    "julie.vignaud@yahoo.com",
    "kevin.durant@gmail.com",
    "sophie.bernadotte@gmail.com",
];

export default function DocumentsPage() {
    const { data: documents = [], isLoading } = useMyDocuments();
    const { data: myGroups = [] } = useMyGroups();
    const { mutateAsync: addDocToGroup, isPending: isAddingDoc } =
        useAddDocToGroup();
    const [selectedDoc, setSelectedDoc] = useState<DocumentFile | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [newName, setNewName] = useState("");
    const [doctypeFilter, setDoctypeFilter] = useState<string>("Tous");

    const [priorityFilter, setPriorityFilter] = useState<
        "Toutes" | "Haute" | "Moyenne" | "Basse"
    >("Toutes");

    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const uniqueDoctypes = [
        "Tous",
        ...Array.from(new Set(documents.map((doc) => doc.doctype))),
    ];

    const filteredDocuments = documents.filter((doc) => {
        const matchPriority =
            priorityFilter === "Toutes" || doc.priority === priorityFilter;

        const matchDoctype =
            doctypeFilter === "Tous" || doc.doctype === doctypeFilter;

        return matchPriority && matchDoctype;
    });

    const [emailInput, setEmailInput] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const [existingGroupAccess, setExistingGroupAccess] =
        useState<AccessGroup[]>(mockGroups);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<string[]>([]);
    const [existingAccess, setExistingAccess] =
        useState<AccessUser[]>(mockUsers);
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

    const handleUpload = (_data: {
        file: File;
        doctype: string;
        priority: "Haute" | "Moyenne" | "Basse";
    }) => {
        // LOC-152 — à câbler avec une vraie mutation API (POST /documents)
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
        setSelectedGroupId("");
        setEmailInput("");
        openDialog("share_modal");
    };

    const confirmDelete = () => {
        // LOC-152 — à câbler avec une vraie mutation API (DELETE /documents/:id)
        closeDialog("delete_modal");
    };

    const confirmRename = () => {
        // LOC-152 — à câbler avec une vraie mutation API (PATCH /documents/:id)
        closeDialog("rename_modal");
    };

    // error and success messages for share.
    const confirmShare = () => {
        if (!selectedDoc) {
            setFeedback({
                type: "error",
                message: feedbackMessages.document.shareSelected,
            });
            return;
        }

        if (selectedUsers.length === 0 && existingGroupAccess.length === 0) {
            setFeedback({
                type: "error",
                message: feedbackMessages.document.shareUsers,
            });
            return;
        }

        try {
            setFeedback({
                type: "success",
                message: feedbackMessages.document.shareSuccess,
            });

            closeDialog("share_modal");
        } catch (error) {
            console.error(error);
            setFeedback({
                type: "error",
                message: feedbackMessages.document.shareError,
            });
        }
    };

    // error and success messages for download.
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

    const addGroup = async () => {
        if (!selectedGroupId || !selectedDoc) return;

        // On trouve le groupe sélectionné dans les vrais groupes
        const selectedGroup = myGroups.find((g) => g.id === selectedGroupId);
        if (!selectedGroup) return;

        // On vérifie que le groupe n'est pas déjà dans la liste locale
        const alreadyExists = existingGroupAccess.some(
            (g) => g.id === selectedGroupId,
        );
        if (alreadyExists) {
            setFeedback({
                type: "error",
                message: "Ce groupe a déjà accès au document.",
            });
            return;
        }

        try {
            // On appelle vraiment le back — POST /groups/:id/documents
            await addDocToGroup({
                groupId: selectedGroupId,
                data: { docId: selectedDoc.id },
            });

            // On met à jour la liste locale pour feedback visuel immédiat
            setExistingGroupAccess((prev) => [
                ...prev,
                { id: selectedGroup.id, name: selectedGroup.name },
            ]);

            setSelectedGroupId("");

            setFeedback({
                type: "success",
                message: "Document partagé avec le groupe avec succès.",
            });
        } catch (error) {
            console.error(error);
            setFeedback({
                type: "error",
                message: feedbackMessages.document.shareError,
            });
        }
    };
    if (isLoading)
        return (
            <main className="min-w-0 bg-[#0b0f14] text-white px-10 py-10">
                <p className="text-gray-400 text-sm">
                    Chargement des documents...
                </p>
            </main>
        );

    return (
        <main className="min-w-0 bg-[#0b0f14] text-white">
            <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-3xl font-bold tracking-wide sm:text-4xl">
                        Mes <span className="text-cyan-400">documents</span>
                    </h1>

                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
                        {/* PRIORITÉ */}
                        <div className="w-full max-w-xs">
                            <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-gray-400">
                                Priorité
                            </label>

                            <select
                                value={priorityFilter}
                                onChange={(e) =>
                                    setPriorityFilter(
                                        e.target.value as
                                            | "Toutes"
                                            | "Haute"
                                            | "Moyenne"
                                            | "Basse",
                                    )
                                }
                                className="w-full rounded-xl border border-cyan-500/10 bg-[#111318] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                            >
                                <option value="Toutes">Toutes</option>
                                <option value="Haute">Haute</option>
                                <option value="Moyenne">Moyenne</option>
                                <option value="Basse">Basse</option>
                            </select>
                        </div>

                        {/* DOCTYPE */}
                        <div className="w-full max-w-xs">
                            <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-gray-400">
                                Type de document
                            </label>

                            <select
                                value={doctypeFilter}
                                onChange={(e) =>
                                    setDoctypeFilter(e.target.value)
                                }
                                className="w-full rounded-xl border border-cyan-500/10 bg-[#111318] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                            >
                                {uniqueDoctypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

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
                <DocumentMobile
                    documents={filteredDocuments}
                    getTypeClasses={getTypeClasses}
                    handleMenuToggle={handleMenuToggle}
                />

                {/* DESKTOP / TABLET */}
                <DocumentDesktop
                    documents={filteredDocuments}
                    getTypeClasses={getTypeClasses}
                    handleMenuToggle={handleMenuToggle}
                />
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

            {/* MODAL UPLOAD */}
            <UploadModal onUpload={handleUpload} />

            {/* MODAL SHARE */}
            <ShareModal
                state={{
                    selectedDoc,
                    feedback,
                    selectedUsers,
                    emailInput,
                    suggestedUsers,
                    existingAccess,
                    selectedGroupId,
                    existingGroupAccess,
                    groups: myGroups.map((group) => ({
                        id: Number(group.id), // ShareModal attend un number pour l'id
                        name: group.name,
                    })),
                }}
                actions={{
                    setEmailInput,
                    setExistingAccess,
                    removeUser,
                    addUser,
                    confirmShare,
                    setSelectedGroupId,
                    setExistingGroupAccess,
                    addGroup,
                }}
            />

            {/* MODAL DELETE */}
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

            <button
                onClick={() => openDialog("upload_modal")}
                title="Ajouter un document"
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-lg hover:bg-cyan-400 transition"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </main>
    );
}

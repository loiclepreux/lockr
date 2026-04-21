import { useEffect, useRef, useState } from "react";
import { Download, Edit2, Share2, Trash2 } from "lucide-react";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import { feedbackMessages } from "../types/feedbackMessage";
import { ShareModal } from "../components/documents/ShareModal";
import { DeleteModal } from "../components/documents/DeleteModal";
import { RenameModal } from "../components/documents/RenameModal";
import { DocumentMobile } from "../components/documents/MobileDocument";
import { DocumentDesktop } from "../components/documents/DesktopDocument";
import { mockDocuments, mockGroups, mockUsers } from "../types/documentFiles";
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
    const [documents, setDocuments] = useState<DocumentFile[]>(mockDocuments);
    const [selectedDoc, setSelectedDoc] = useState<DocumentFile | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [newName, setNewName] = useState("");

    const [priorityFilter, setPriorityFilter] = useState<
        "Toutes" | "Haute" | "Moyenne" | "Basse"
    >("Toutes");

    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const filteredDocuments = documents.filter((doc) => {
        if (priorityFilter === "Toutes") return true;
        return doc.priority === priorityFilter;
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

        if (selectedUsers.length === 0 && !selectedGroupId) {
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

    const addGroup = () => {
        if (!selectedGroupId) return;

        const selectedGroup = mockGroups.find(
            (group) => String(group.id) === selectedGroupId,
        );

        if (!selectedGroup) return;

        const alreadyExists = existingGroupAccess.some(
            (group) => String(group.id) === selectedGroupId,
        );

        if (alreadyExists) {
            setFeedback({
                type: "error",
                message: "Ce groupe a déjà accès au document.",
            });
            return;
        }

        setExistingGroupAccess((prev) => [
            ...prev,
            {
                id: String(selectedGroup.id),
                name: selectedGroup.name,
            },
        ]);

        setSelectedGroupId("");
    };

    return (
        <main className="min-w-0 bg-[#0b0f14] text-white">
            <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-3xl font-bold tracking-wide sm:text-4xl">
                        Mes <span className="text-cyan-400">documents</span>
                    </h1>

                    <div className="mt-4 flex gap-3">
                        {["Toutes", "Haute", "Moyenne", "Basse"].map((p) => (
                            <button
                                key={p}
                                onClick={() =>
                                    setPriorityFilter(
                                        p as
                                            | "Toutes"
                                            | "Haute"
                                            | "Moyenne"
                                            | "Basse",
                                    )
                                }
                                className={`px-4 py-2 rounded-xl text-sm transition ${
                                    priorityFilter === p
                                        ? "bg-cyan-500 text-black"
                                        : "bg-[#111318] text-gray-300 hover:bg-cyan-500/10"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
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
                    groups: mockGroups.map((group) => ({
                        id: Number(group.id),
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
        </main>
    );
}

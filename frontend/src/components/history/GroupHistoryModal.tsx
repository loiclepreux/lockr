import { useState } from "react";
import { useGroupHistory } from "../../hooks/useActivityLog";
import type { ActivityAction, IHistory } from "../../types/IHistory";

const actionConfig: Record<
    ActivityAction,
    { label: string; className: string }
> = {
    CREATE_DOCUMENT: {
        label: "Création document",
        className:
            "badge badge-sm bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    UPDATE_DOCUMENT: {
        label: "Modification document",
        className:
            "badge badge-sm bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    },
    DELETE_DOCUMENT: {
        label: "Corbeille",
        className:
            "badge badge-sm bg-red-500/20 text-red-400 border-red-500/30",
    },
    RESTORE_DOCUMENT: {
        label: "Restauration",
        className:
            "badge badge-sm bg-green-500/20 text-green-400 border-green-500/30",
    },
    PERMANENT_DELETE_DOCUMENT: {
        label: "Suppression définitive",
        className:
            "badge badge-sm bg-red-700/20 text-red-300 border-red-700/30",
    },
    SHARE_DOCUMENT: {
        label: "Partage",
        className:
            "badge badge-sm bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
    REVOKE_SHARE: {
        label: "Révocation",
        className:
            "badge badge-sm bg-orange-500/20 text-orange-400 border-orange-500/30",
    },
    ADD_DOC_IN_GROUP: {
        label: "Document ajouté",
        className:
            "badge badge-sm bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    REMOVE_DOC_IN_GROUP: {
        label: "Document retiré",
        className:
            "badge badge-sm bg-orange-500/20 text-orange-400 border-orange-500/30",
    },
    ADD_USER_IN_GROUP: {
        label: "Membre ajouté",
        className:
            "badge badge-sm bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    },
    REMOVE_USER_IN_GROUP: {
        label: "Membre retiré",
        className:
            "badge badge-sm bg-red-500/20 text-red-400 border-red-500/30",
    },
    CREATE_GROUP: {
        label: "Groupe créé",
        className:
            "badge badge-sm bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    UPDATE_GROUP: {
        label: "Groupe modifié",
        className:
            "badge badge-sm bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    },
    DELETE_GROUP: {
        label: "Groupe supprimé",
        className:
            "badge badge-sm bg-red-500/20 text-red-400 border-red-500/30",
    },
};

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const ITEMS_PER_PAGE = 5;

interface GroupHistoryModalProps {
    groupId: string;
    groupName: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function GroupHistoryModal({
    groupId,
    groupName,
    isOpen,
    onClose,
}: GroupHistoryModalProps) {
    const { data: history = [], isLoading } = useGroupHistory(groupId);

    const [filterAction, setFilterAction] = useState<ActivityAction | "all">(
        "all",
    );
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = (history as IHistory[]).filter(
        (entry) => filterAction === "all" || entry.actionType === filterAction,
    );

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const handleFilterAction = (value: ActivityAction | "all") => {
        setFilterAction(value);
        setCurrentPage(1);
    };

    if (!isOpen) return null;

    return (
        <dialog open className="modal">
            <div className="modal-backdrop" onClick={onClose} />

            <div className="modal-box max-w-2xl rounded-2xl border border-cyan-500/20 bg-[#0f1115] text-white shadow-[0_0_30px_rgba(0,255,255,0.08)]">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-wide">
                            Historique
                        </h2>
                        <p className="mt-0.5 text-xs text-gray-400">
                            {groupName}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost cursor-pointer text-gray-400 transition-all duration-300 hover:bg-red-500 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <select
                    value={filterAction}
                    onChange={(e) =>
                        handleFilterAction(
                            e.target.value as ActivityAction | "all",
                        )
                    }
                    className="select select-sm mb-5 rounded-xl border border-cyan-500/20 text-white focus:border-cyan-500/50 focus:outline-none [&>option]:bg-[#0f1115]"
                >
                    <option value="all">Toutes les actions</option>

                    {Object.entries(actionConfig).map(([value, config]) => (
                        <option key={value} value={value}>
                            {config.label}
                        </option>
                    ))}
                </select>

                {isLoading ? (
                    <p className="py-10 text-center text-sm text-gray-400">
                        Chargement...
                    </p>
                ) : paginated.length === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-400">
                        Aucun résultat.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-gray-400">
                                    <th className="bg-transparent pb-3">
                                        Action
                                    </th>
                                    <th className="bg-transparent pb-3">
                                        Détail
                                    </th>
                                    <th className="bg-transparent pb-3">Par</th>
                                    <th className="bg-transparent pb-3">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginated.map((entry) => (
                                    <tr
                                        key={entry.id}
                                        className="border-b border-white/5 transition-colors hover:bg-cyan-500/5"
                                    >
                                        <td className="py-3">
                                            <span
                                                className={
                                                    actionConfig[
                                                        entry.actionType
                                                    ].className
                                                }
                                            >
                                                {
                                                    actionConfig[
                                                        entry.actionType
                                                    ].label
                                                }
                                            </span>
                                        </td>

                                        <td className="py-3 font-medium text-white">
                                            {entry.log}
                                        </td>

                                        <td className="py-3 text-gray-400">
                                            {entry.user?.profile?.firstName ||
                                            entry.user?.profile?.lastName
                                                ? `${entry.user?.profile?.firstName ?? ""} ${
                                                      entry.user?.profile
                                                          ?.lastName ?? ""
                                                  }`.trim()
                                                : (entry.user?.email ??
                                                  "Utilisateur")}
                                        </td>

                                        <td className="py-3 text-xs text-gray-500">
                                            {formatDate(entry.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                        <p className="text-xs text-gray-500">
                            {filtered.length} résultat
                            {filtered.length > 1 ? "s" : ""}
                        </p>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => p - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-xs rounded-lg border border-cyan-500/20 bg-white/3 text-gray-400 hover:text-white disabled:opacity-30"
                            >
                                ←
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <button
                                    type="button"
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`btn btn-xs rounded-lg border ${
                                        page === currentPage
                                            ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-400"
                                            : "border-cyan-500/20 bg-white/3 text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => p + 1)}
                                disabled={currentPage === totalPages}
                                className="btn btn-xs rounded-lg border border-cyan-500/20 bg-white/3 text-gray-400 hover:text-white disabled:opacity-30"
                            >
                                →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </dialog>
    );
}

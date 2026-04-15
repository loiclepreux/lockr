// src/components/groups/GroupHistoryModal.tsx

import { useState } from "react";
import { useGroupHistory } from "../../hooks/useHistory";
import type { HistoryAction } from "../../types/IHistory";

const actionConfig: Record<HistoryAction, { label: string; className: string }> = {
    create:   { label: "Création",        className: "badge badge-sm bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    update:   { label: "Modification",    className: "badge badge-sm bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
    delete:   { label: "Suppression",     className: "badge badge-sm bg-red-500/20 text-red-400 border-red-500/30" },
    share:    { label: "Partage",         className: "badge badge-sm bg-purple-500/20 text-purple-400 border-purple-500/30" },
    download: { label: "Téléchargement",  className: "badge badge-sm bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
};

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

const ITEMS_PER_PAGE = 5;

interface GroupHistoryModalProps {
    groupId: string;
    groupName: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function GroupHistoryModal({ groupId, groupName, isOpen, onClose }: GroupHistoryModalProps) {
    const { data: history, isLoading } = useGroupHistory(groupId);

    const [filterAction, setFilterAction] = useState<HistoryAction | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = (history ?? []).filter((entry) =>
        filterAction === "all" || entry.action === filterAction
    );

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleFilterAction = (value: HistoryAction | "all") => {
        setFilterAction(value);
        setCurrentPage(1); // reset page à chaque changement de filtre
    };

    if (!isOpen) return null;

    return (
        <dialog open className="modal">
            <div className="modal-backdrop" onClick={onClose} />

            <div className="modal-box max-w-2xl bg-[#0f1115] text-white border border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.08)] rounded-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-wide">Historique</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{groupName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white hover:bg-red-500 transition-all duration-300 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Filtre */}
              <select
    value={filterAction}
    onChange={(e) => handleFilterAction(e.target.value as HistoryAction | "all")}
    className="select select-sm border border-cyan-500/20 text-white focus:outline-none focus:border-cyan-500/50 rounded-xl [&>option]:bg-[#0f1115]"
>
    <option value="all">Toutes les actions</option>
    <option value="create">Création</option>
    <option value="update">Modification</option>
    <option value="delete">Suppression</option>
    <option value="share">Partage</option>
    <option value="download">Téléchargement</option>
</select>

                {/* Tableau */}
                {isLoading ? (
                    <p className="text-sm text-gray-400 py-10 text-center">Chargement...</p>
                ) : paginated.length === 0 ? (
                    <p className="text-sm text-gray-400 py-10 text-center">Aucun résultat.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-widest">
                                    <th className="bg-transparent pb-3">Action</th>
                                    <th className="bg-transparent pb-3">Élément</th>
                                    <th className="bg-transparent pb-3">Par</th>
                                    <th className="bg-transparent pb-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((entry) => (
                                    <tr key={entry.id} className="border-b border-white/5 hover:bg-cyan-500/5 transition-colors">
                                        <td className="py-3">
                                            <span className={actionConfig[entry.action].className}>
                                                {actionConfig[entry.action].label}
                                            </span>
                                        </td>
                                        <td className="py-3 text-white font-medium">{entry.targetName}</td>
                                        <td className="py-3 text-gray-400">{entry.performedBy}</td>
                                        <td className="py-3 text-gray-500 text-xs">{formatDate(entry.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                        <p className="text-xs text-gray-500">
                            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => p - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-xs bg-white/3 border border-cyan-500/20 text-gray-400 hover:text-white disabled:opacity-30 rounded-lg"
                            >
                                ←
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`btn btn-xs rounded-lg border ${
                                        page === currentPage
                                            ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                                            : "bg-white/3 border-cyan-500/20 text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((p) => p + 1)}
                                disabled={currentPage === totalPages}
                                className="btn btn-xs bg-white/3 border border-cyan-500/20 text-gray-400 hover:text-white disabled:opacity-30 rounded-lg"
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
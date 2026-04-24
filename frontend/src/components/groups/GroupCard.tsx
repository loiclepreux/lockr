import { useState } from "react";
import { History, Trash2 } from "lucide-react";
import GroupHistoryModal from "../history/GroupHistoryModal";
import { useAuthStore } from "../../stores/useAuthStore";
import { useDeleteGroup } from "../../hooks/useGroups";

interface GroupCardProps {
    id: string;
    name: string;
    description: string;
    membersCount: number;
    creatorId: string; // 👈 nouvelle prop
}

export default function GroupCard({
    id,
    name,
    description,
    membersCount,
    creatorId,
}: GroupCardProps) {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const userId = useAuthStore((state) => state.user?.id);
    const { mutate: deleteGroup, isPending } = useDeleteGroup();

    // Le bouton supprimer n'apparaît que si je suis le créateur
    const isCreator = userId === creatorId;

    const handleDelete = () => {
        if (!confirm("Supprimer ce groupe ?")) return;
        deleteGroup(id);
    };

    return (
        <>
            <div className="group rounded-2xl border border-white/5 bg-[#0f1115] p-4 flex items-center justify-between hover:border-cyan-500/20 hover:bg-cyan-500/[0.03] hover:shadow-[0_0_25px_rgba(0,255,255,0.04)] transition-all duration-200">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg shrink-0 transition group-hover:bg-cyan-500/15">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-white font-medium text-sm truncate">
                            {name}
                        </span>
                        <span className="text-gray-400 text-xs truncate">
                            {description}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-gray-400 text-xs">
                        {membersCount} {membersCount > 1 ? "membres" : "membre"}
                    </span>

                    <button
                        onClick={() => setIsHistoryOpen(true)}
                        title="Voir l'historique"
                        className="p-2 rounded-xl text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200 cursor-pointer"
                    >
                        <History size={18} />
                    </button>

                    {/* Bouton supprimer — visible uniquement pour le créateur */}
                    {isCreator && (
                        <button
                            onClick={handleDelete}
                            disabled={isPending}
                            title="Supprimer le groupe"
                            className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer disabled:opacity-50"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            <GroupHistoryModal
                groupId={id}
                groupName={name}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
        </>
    );
}

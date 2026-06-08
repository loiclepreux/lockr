import {
    useGroupById,
    useGroupDocuments,
    useRemoveDocFromGroup,
    useAddMember,
    useRemoveMember,
} from "../../hooks/useGroups";
import { useState } from "react";
import { useAddDocToGroup, useRawDocuments } from "../../hooks/useDocuments";
import { useGroupHistory } from "../../hooks/useActivityLog";
import GroupHistoryModal from "../history/GroupHistoryModal";

type GroupDetailsProps = {
    groupId: string;
};

type ActivityLogItem = {
    id: string;
    log: string;
    createdAt: string;
};

type GroupDocumentItem = {
    groupId: string;
    docId: string;
    expirationDate: string | null;
    createdAt: string;
    updatedAt: string;
    doc: {
        id: string;
        name: string;
        extension: string;
        size: string;
        status: string;
        priority: string;
        createdAt: string;
        updatedAt: string;
    };
};

export default function GroupDetails({ groupId }: GroupDetailsProps) {
    const { data: group, isLoading: loadingGroup } = useGroupById(groupId);
    const { data: documents = [], isLoading: loadingDocs } =
        useGroupDocuments(groupId);

    const [memberUserId, setMemberUserId] = useState("");
    const [memberRole, setMemberRole] = useState<"moderator" | "user">("user");
    const { data: availableDocuments = [] } = useRawDocuments();
    const [selectedDocId, setSelectedDocId] = useState("");
    const { data: history = [] } = useGroupHistory(groupId);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const addDocMutation = useAddDocToGroup();
    const removeMemberMutation = useRemoveMember();
    const removeDocMutation = useRemoveDocFromGroup();
    const addMemberMutation = useAddMember();

    if (loadingGroup) {
        return (
            <section className="rounded-2xl border border-cyan-500/10 bg-[#111318] p-6">
                <p className="text-gray-400">Chargement du groupe...</p>
            </section>
        );
    }

    if (!group) {
        return (
            <section className="rounded-2xl border border-red-500/20 bg-[#111318] p-6">
                <p className="text-red-400">Groupe introuvable.</p>
            </section>
        );
    }

    const handleAddMember = () => {
        if (!memberUserId.trim()) {
            return;
        }

        addMemberMutation.mutate(
            {
                groupId,
                member: {
                    userId: memberUserId.trim(),
                    role: memberRole,
                },
            },
            {
                onSuccess: () => {
                    setMemberUserId("");
                    setMemberRole("user");
                },
            },
        );
    };

    const handleAddDocument = () => {
        if (!selectedDocId) {
            return;
        }

        addDocMutation.mutate(
            {
                groupId,
                data: {
                    docId: selectedDocId,
                },
            },
            {
                onSuccess: () => {
                    setSelectedDocId("");
                },
            },
        );
    };

    return (
        <section className="rounded-2xl border border-cyan-500/10 bg-[#111318] p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-cyan-400">
                    {group.name}
                </h2>

                <p className="mt-2 text-gray-400">
                    {group.description || "Aucune description"}
                </p>

                <button
                    type="button"
                    onClick={() => setIsHistoryOpen(true)}
                    className="mt-4 rounded-xl border border-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/10"
                >
                    Voir l'historique
                </button>
            </div>

            {/* Membres */}
            <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-white">
                    Membres
                </h3>

                <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_auto]">
                    <input
                        type="text"
                        value={memberUserId}
                        onChange={(e) => setMemberUserId(e.target.value)}
                        placeholder="ID de l'utilisateur à ajouter"
                        className="rounded-xl border border-cyan-500/10 bg-[#0f1115] px-4 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-cyan-400"
                    />

                    <select
                        value={memberRole}
                        onChange={(e) =>
                            setMemberRole(
                                e.target.value as "moderator" | "user",
                            )
                        }
                        className="rounded-xl border border-cyan-500/10 bg-[#0f1115] px-4 py-2 text-sm text-white outline-none focus:border-cyan-400"
                    >
                        <option value="user">Utilisateur</option>
                        <option value="moderator">Modérateur</option>
                    </select>

                    <button
                        type="button"
                        onClick={handleAddMember}
                        disabled={addMemberMutation.isPending}
                        className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
                    >
                        {addMemberMutation.isPending ? "Ajout..." : "Ajouter"}
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    {group.users.map((member) => (
                        <div
                            key={member.userId}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0f1115] p-3"
                        >
                            <span className="text-gray-300">
                                {member.user?.email ?? member.userId}
                            </span>

                            <button
                                onClick={() =>
                                    removeMemberMutation.mutate({
                                        groupId,
                                        userId: member.userId,
                                    })
                                }
                                className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-400"
                            >
                                Retirer
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Documents */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                    Documents
                </h3>

                <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
                    <select
                        value={selectedDocId}
                        onChange={(e) => setSelectedDocId(e.target.value)}
                        className="rounded-xl border border-cyan-500/10 bg-[#0f1115] px-4 py-2 text-sm text-white outline-none focus:border-cyan-400"
                    >
                        <option value="">Choisir un document</option>

                        {availableDocuments.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                                {doc.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={handleAddDocument}
                        disabled={addDocMutation.isPending || !selectedDocId}
                        className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
                    >
                        {addDocMutation.isPending ? "Ajout..." : "Ajouter"}
                    </button>
                </div>

                {loadingDocs ? (
                    <p className="text-gray-400">Chargement des documents...</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {(documents as GroupDocumentItem[]).map((item) => (
                            <div
                                key={item.docId}
                                className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0f1115] p-3"
                            >
                                <div>
                                    <p className="text-white">
                                        {item.doc.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {item.doc.extension}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        removeDocMutation.mutate({
                                            groupId,
                                            docId: item.docId,
                                        })
                                    }
                                    className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-400"
                                >
                                    Retirer
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {history.length === 0 ? (
                    <p className="text-gray-400">
                        Aucun historique disponible.
                    </p>
                ) : (
                    (history as ActivityLogItem[]).map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl border border-white/5 bg-[#0f1115] p-3"
                        >
                            <p className="text-white">{item.log}</p>

                            <p className="mt-1 text-xs text-gray-500">
                                {new Date(item.createdAt).toLocaleString(
                                    "fr-FR",
                                )}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <GroupHistoryModal
                groupId={groupId}
                groupName={group.name}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
        </section>
    );
}

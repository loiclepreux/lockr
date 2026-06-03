import {
    useGroupById,
    useGroupDocuments,
    useRemoveDocFromGroup,
    useRemoveMember,
} from "../../hooks/useGroups";

type GroupDetailsProps = {
    groupId: string;
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

    const removeMemberMutation = useRemoveMember();
    const removeDocMutation = useRemoveDocFromGroup();

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

    return (
        <section className="rounded-2xl border border-cyan-500/10 bg-[#111318] p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-cyan-400">
                    {group.name}
                </h2>

                <p className="mt-2 text-gray-400">
                    {group.description || "Aucune description"}
                </p>
            </div>

            {/* Membres */}
            <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-white">
                    Membres
                </h3>

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
        </section>
    );
}

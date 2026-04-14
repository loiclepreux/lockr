import { useState } from "react";
import CreateGroupModal from "../components/groups/CreateGroupModal";
import GroupList from "../components/groups/GroupList";
import { useMyGroups, useSharedGroups } from "../hooks/useGroups";

export default function GroupPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: myGroups, isLoading: loadingMine } = useMyGroups();
    const { data: sharedGroups, isLoading: loadingShared } = useSharedGroups();

    return (
        <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10 text-white">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
                {/* Header */}
                <header className="flex flex-col gap-3">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
                        Mes <span className="text-cyan-400">groupes</span>
                    </h1>
                    <p className="text-sm text-gray-400">
                        Gérez vos groupes personnels et les groupes partagés avec vous.
                    </p>
                </header>

                {/* Mes groupes */}
                <section className="rounded-2xl border border-cyan-500/10 bg-[#111318] p-4 sm:p-6">
                    {loadingMine ? (
                        <p className="text-sm text-gray-400 text-center py-10">
                            Chargement de vos groupes...
                        </p>
                    ) : (
                        <GroupList title="Mes groupes" groups={myGroups ?? []} />
                    )}
                </section>

                {/* Groupes partagés */}
                <section className="rounded-2xl border border-cyan-500/10 bg-[#111318] p-4 sm:p-6">
                    {loadingShared ? (
                        <p className="text-sm text-gray-400 text-center py-10">
                            Chargement des groupes partagés...
                        </p>
                    ) : (
                        <GroupList
                            title="Groupes partagés avec moi"
                            groups={sharedGroups ?? []}
                        />
                    )}
                </section>
            </div>

            {/* Bouton flottant */}
            <button
                onClick={() => setIsModalOpen(true)}
                title="Créer un groupe"
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-lg hover:bg-cyan-400 transition"
            >
                +
            </button>

            <CreateGroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </main>
    );
}
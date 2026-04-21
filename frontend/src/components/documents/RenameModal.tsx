interface RenameModalProps {
    selectedDoc: { name: string } | null;
    newName: string;
    setNewName: (val: string) => void;
    confirmRename: () => void;
}

export function RenameModal({
    selectedDoc,
    newName,
    setNewName,
    confirmRename,
}: RenameModalProps) {
    return (
        <dialog
            id="rename_modal"
            className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
        >
            <div className="w-full max-w-lg rounded-2xl border border-cyan-500/10 bg-[#111318] p-5 text-white shadow-[0_0_40px_rgba(0,255,255,0.04)] sm:p-8">
                <h3 className="text-xl font-bold text-cyan-400">
                    Renommer le document
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                    Entrez un nouveau nom pour votre fichier.
                </p>

                <div className="mt-5">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full rounded-xl border border-cyan-500/10 bg-[#0f1115] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                        placeholder="Nouveau nom"
                    />
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <form method="dialog">
                        <button className="w-full rounded-xl border border-white/10 px-4 py-2 text-gray-300 transition hover:bg-white/5 sm:w-auto">
                            Annuler
                        </button>
                    </form>
                    <button
                        type="button"
                        onClick={confirmRename}
                        className="w-full rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-black transition hover:bg-cyan-400 sm:w-auto"
                    >
                        Enregistrer
                    </button>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop bg-black/50">
                <button>fermer</button>
            </form>
        </dialog>
    );
}

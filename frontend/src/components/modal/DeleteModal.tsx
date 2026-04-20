interface DeleteModalProps {
    selectedDoc: { name: string } | null;
    confirmDelete: () => void;
}

export function DeleteModal({ selectedDoc, confirmDelete }: DeleteModalProps) {
    return (
        <dialog
            id="delete_modal"
            className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
        >
            <div className="w-full max-w-md rounded-2xl border border-red-500/10 bg-[#111318] p-5 text-white shadow-[0_0_40px_rgba(255,0,0,0.04)] sm:p-8">
                <h3 className="text-xl font-bold text-red-400">
                    Supprimer le document
                </h3>

                <p className="py-4 text-sm leading-relaxed text-gray-400">
                    Confirmer la suppression de{" "}
                    <span className="break-all font-medium text-white">
                        {selectedDoc?.name}
                    </span>{" "}
                    ?
                </p>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <form method="dialog">
                        <button className="w-full rounded-xl border border-white/10 px-4 py-2 text-gray-300 transition hover:bg-white/5 sm:w-auto">
                            Annuler
                        </button>
                    </form>
                    <button
                        type="button"
                        onClick={confirmDelete}
                        className="w-full rounded-xl bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-400 sm:w-auto"
                    >
                        Supprimer
                    </button>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop bg-black/50">
                <button>fermer</button>
            </form>
        </dialog>
    );
}

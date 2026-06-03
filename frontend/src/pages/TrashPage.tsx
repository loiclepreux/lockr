import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getTrashDocuments,
    permanentDeleteDocument,
    restoreDocument,
} from "../api/trash.api";

export default function TrashPage() {
    const queryClient = useQueryClient();

    const { data: documents = [], isLoading } = useQuery({
        queryKey: ["trash-documents"],
        queryFn: getTrashDocuments,
    });

    const restoreMutation = useMutation({
        mutationFn: restoreDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trash-documents"],
            });

            queryClient.invalidateQueries({
                queryKey: ["documents"],
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: permanentDeleteDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trash-documents"],
            });
        },
    });

    if (isLoading) {
        return (
            <div className="p-8 text-slate-400">
                Chargement de la corbeille...
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Corbeille</h1>

                <p className="mt-2 text-slate-400">
                    Documents supprimés récemment.
                </p>
            </div>

            {documents.length === 0 ? (
                <div className="rounded-2xl border border-cyan-500/10 bg-[#111318] p-8 text-center text-slate-400">
                    Aucun document dans la corbeille.
                </div>
            ) : (
                <div className="grid gap-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="rounded-2xl border border-cyan-500/10 bg-[#111318] p-5"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h3 className="font-semibold text-white">
                                        {doc.name}
                                    </h3>

                                    <p className="text-sm text-slate-400">
                                        Type : {doc.extension.toUpperCase()}
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        Supprimé le{" "}
                                        {doc.deletedAt
                                            ? new Date(
                                                  doc.deletedAt,
                                              ).toLocaleDateString("fr-FR")
                                            : "-"}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() =>
                                            restoreMutation.mutate(doc.id)
                                        }
                                        className="rounded-xl bg-cyan-500 px-4 py-2 font-medium text-black hover:bg-cyan-400"
                                    >
                                        Restaurer
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteMutation.mutate(doc.id)
                                        }
                                        className="rounded-xl bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-400"
                                    >
                                        Supprimer définitivement
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { MoreVertical } from "lucide-react";
import type { DocumentFile } from "../../types/documentFiles";

interface DocumentDesktopProps {
    documents: DocumentFile[];
    getTypeClasses: (type: string) => string;
    handleMenuToggle: (
        doc: DocumentFile,
        e: React.MouseEvent<HTMLButtonElement>,
    ) => void;
}

const getDocTypeClasses = (doctype: string) => {
    switch (doctype) {
        case "Contrat":
            return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
        case "Facture":
            return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
        case "Identité":
            return "bg-violet-500/10 text-violet-400 border border-violet-500/20";
        case "CV":
            return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
        case "Présentation":
            return "bg-pink-500/10 text-pink-400 border border-pink-500/20";
        default:
            return "bg-slate-500/10 text-slate-300 border border-slate-500/20";
    }
};

const getPriorityClasses = (priority: DocumentFile["priority"]) => {
    switch (priority) {
        case "Haute":
            return "bg-red-500/10 text-red-400 border border-red-500/20";
        case "Moyenne":
            return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
        case "Basse":
            return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
};

export function DocumentDesktop({
    documents,
    getTypeClasses,
    handleMenuToggle,
}: DocumentDesktopProps) {
    return (
        <div className="hidden md:block rounded-2xl border border-cyan-500/10 bg-[#111318] shadow-[0_0_40px_rgba(0,255,255,0.03)]">
            <div className="overflow-x-auto rounded-2xl">
                <table className="w-full border-separate border-spacing-0">
                    <thead className="sticky top-0 z-10 bg-[#0f1115] border-b border-white/5">
                        <tr className="text-xs uppercase tracking-[0.18em] text-gray-400">
                            <th className="px-4 py-4 text-left font-semibold lg:px-6 lg:py-5">
                                Nom
                            </th>
                            <th className="px-4 py-4 text-left font-semibold lg:px-6 lg:py-5">
                                Taille
                            </th>
                            <th className="px-4 py-4 text-center font-semibold lg:px-6 lg:py-5">
                                Date d'ajout
                            </th>
                            <th className="px-4 py-4 text-center font-semibold lg:px-6 lg:py-5">
                                Statut
                            </th>
                            <th className="px-4 py-4 text-center font-semibold lg:px-6 lg:py-5">
                                Priorité
                            </th>
                            <th className="px-4 py-4 text-right font-semibold lg:px-6 lg:py-5 lg:pr-8">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {documents.map((doc) => (
                            <tr
                                key={doc.id}
                                className="hover:bg-cyan-500/5 transition-all duration-200"
                            >
                                <td className="border-b border-white/5 px-4 py-4 lg:px-6 lg:py-5">
                                    <div className="flex min-w-0 items-center gap-3 lg:gap-4">
                                        <div
                                            className={`shrink-0 rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getTypeClasses(
                                                doc.type,
                                            )}`}
                                        >
                                            {doc.type}
                                        </div>

                                        <span className="max-w-[220px] truncate font-medium text-white lg:max-w-[420px]">
                                            {doc.name}
                                        </span>
                                    </div>
                                </td>

                                <td className="border-b border-white/5 px-4 py-4 text-gray-400 lg:px-6 lg:py-5">
                                    {doc.size}
                                </td>

                                <td className="border-b border-white/5 px-4 py-4 text-center text-gray-400 lg:px-6 lg:py-5">
                                    {doc.date}
                                </td>

                                <td className="border-b border-white/5 px-4 py-4 text-center lg:px-6 lg:py-5">
                                    <span
                                        className={`inline-block rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getDocTypeClasses(
                                            doc.doctype,
                                        )}`}
                                    >
                                        {doc.doctype}
                                    </span>
                                </td>

                                <td className="border-b border-white/5 px-4 py-4 text-center lg:px-6 lg:py-5">
                                    <span
                                        className={`inline-block rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getPriorityClasses(
                                            doc.priority,
                                        )}`}
                                    >
                                        {doc.priority}
                                    </span>
                                </td>

                                <td className="border-b border-white/5 px-4 py-4 text-right lg:px-6 lg:py-5 lg:pr-8">
                                    <button
                                        type="button"
                                        className="rounded-lg p-2 text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
                                        onClick={(e) =>
                                            handleMenuToggle(doc, e)
                                        }
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

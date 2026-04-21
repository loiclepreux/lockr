import { MoreVertical } from "lucide-react";
import type { DocumentFile } from "../../types/documentFiles";

interface DocumentMobileProps {
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

export function DocumentMobile({
    documents,
    getTypeClasses,
    handleMenuToggle,
}: DocumentMobileProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:hidden">
            {documents.map((doc) => (
                <div
                    key={doc.id}
                    className="rounded-2xl border border-cyan-500/10 bg-[#111318] p-4 shadow-[0_0_30px_rgba(0,255,255,0.03)]"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <div
                                className={`inline-flex rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getTypeClasses(doc.type)}`}
                            >
                                {doc.type}
                            </div>
                            <p className="mt-3 break-words text-sm font-medium text-white">
                                {doc.name}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <span
                                    className={`inline-flex rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getDocTypeClasses(
                                        doc.doctype,
                                    )}`}
                                >
                                    {doc.doctype}
                                </span>

                                <span
                                    className={`inline-flex rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getPriorityClasses(
                                        doc.priority,
                                    )}`}
                                >
                                    {doc.priority}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="shrink-0 rounded-lg p-2 text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
                            onClick={(e) => handleMenuToggle(doc, e)}
                        >
                            <MoreVertical size={18} />
                        </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-400">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.date}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

import { MoreVertical } from "lucide-react";

interface DocumentFile {
    id: number;
    name: string;
    size: string;
    date: string;
    type: string;
}

interface DocumentMobileProps {
    documents: DocumentFile[];
    getTypeClasses: (type: string) => string;
    handleMenuToggle: (doc: DocumentFile, e: React.MouseEvent<HTMLButtonElement>) => void;
}

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
                            <div className={`inline-flex rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getTypeClasses(doc.type)}`}>
                                {doc.type}
                            </div>
                            <p className="mt-3 break-words text-sm font-medium text-white">
                                {doc.name}
                            </p>
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
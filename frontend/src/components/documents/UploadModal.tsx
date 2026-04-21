import { useRef, useState } from "react";
import { FileUp, Upload, X } from "lucide-react";

interface UploadModalProps {
    onUpload: (data: {
        file: File;
        doctype: string;
        priority: "Haute" | "Moyenne" | "Basse";
    }) => void;
}

export function UploadModal({ onUpload }: UploadModalProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [doctype, setDoctype] = useState("");
    const [priority, setPriority] = useState<"Haute" | "Moyenne" | "Basse">(
        "Moyenne",
    );

    const closeDialog = () => {
        const modal = document.getElementById(
            "upload_modal",
        ) as HTMLDialogElement | null;
        if (modal) modal.close();
    };

    const resetForm = () => {
        setSelectedFile(null);
        setIsDragging(false);
        setDoctype("");
        setPriority("Moyenne");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClose = () => {
        resetForm();
        closeDialog();
    };

    const handleFileSelection = (file: File | null) => {
        if (!file) return;
        setSelectedFile(file);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0] ?? null;
        handleFileSelection(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleSubmit = () => {
        if (!selectedFile || !doctype.trim) return;

        onUpload({
            file: selectedFile,
            doctype: doctype.trim(),
            priority,
        });

        handleClose();
    };

    return (
        <dialog
            id="upload_modal"
            className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
        >
            <div className="w-full max-w-md rounded-2xl border border-cyan-500/10 bg-[#111318] p-5 text-white shadow-[0_0_40px_rgba(0,255,255,0.05)] sm:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 text-cyan-400">
                            <FileUp size={24} />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold">
                                Ajouter un document
                            </h3>
                            <p className="mt-1 text-sm text-gray-400">
                                Importez un fichier puis renseignez ses
                                informations.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-xl p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                        handleFileSelection(e.target.files?.[0] ?? null)
                    }
                />

                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
                        isDragging
                            ? "border-cyan-400 bg-cyan-500/10"
                            : "border-cyan-500/20 bg-[#0f1115]"
                    }`}
                >
                    <div className="flex flex-col items-center justify-center">
                        <div className="mb-3 rounded-full border border-cyan-500/20 bg-cyan-500/10 p-4 text-cyan-400">
                            <Upload size={24} />
                        </div>

                        <p className="text-sm font-medium text-white">
                            Glissez-déposez votre fichier ici
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            ou utilisez le bouton ci-dessous pour parcourir vos
                            fichiers
                        </p>

                        <button
                            type="button"
                            onClick={handleBrowseClick}
                            className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400"
                        >
                            Parcourir
                        </button>

                        {selectedFile && (
                            <div className="mt-4 rounded-xl border border-cyan-500/10 bg-[#111318] px-4 py-3 text-sm text-cyan-400">
                                {selectedFile.name}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-gray-400">
                            Type
                        </label>
                        <input
                            type="text"
                            value={doctype}
                            onChange={(e) => setDoctype(e.target.value)}
                            placeholder="Ex : Contrat, Facture, Identité..."
                            className="w-full rounded-xl border border-cyan-500/10 bg-[#0f1115] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-gray-400">
                            Priorité
                        </label>
                        <select
                            value={priority}
                            onChange={(e) =>
                                setPriority(
                                    e.target.value as
                                        | "Haute"
                                        | "Moyenne"
                                        | "Basse",
                                )
                            }
                            className="w-full rounded-xl border border-cyan-500/10 bg-[#0f1115] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                        >
                            <option value="Haute">Haute</option>
                            <option value="Moyenne">Moyenne</option>
                            <option value="Basse">Basse</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full rounded-xl border border-white/10 px-4 py-2 text-gray-300 transition hover:bg-white/5 sm:w-auto"
                    >
                        Annuler
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-black transition hover:bg-cyan-400 sm:w-auto"
                    >
                        Ajouter
                    </button>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop bg-black/50">
                <button onClick={handleClose}>fermer</button>
            </form>
        </dialog>
    );
}

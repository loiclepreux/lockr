import { ImagePlus, Upload, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import FeedbackMessage from "../ui/FeedbackMessage";
import { feedbackMessages } from "../../types/feedbackMessage";

interface ChangePhotoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (file: File | null) => void;
}

const ChangePhotoModal = ({
    isOpen,
    onClose,
    onSubmit,
}: ChangePhotoModalProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    if (!isOpen) return null;

    const resetModal = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setSelectedFile(null);
        setPreview(null);
        setIsDragging(false);
        setFeedback(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const handleFile = (file: File | null) => {
        setFeedback(null);

        if (!file) return;

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
        ];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            setFeedback({
                type: "error",
                message: feedbackMessages.profile.photoType,
            });
            return;
        }

        if (file.size > maxSize) {
            setFeedback({
                type: "error",
                message: feedbackMessages.profile.photoSize,
            });
            return;
        }

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0] || null;
        handleFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleSubmit = () => {
        setFeedback(null);

        if (!selectedFile) {
            setFeedback({
                type: "error",
                message: feedbackMessages.profile.photoSelected,
            });
            return;
        }

        if (onSubmit) {
            onSubmit(selectedFile);
        }

        setFeedback({
            type: "success",
            message: feedbackMessages.profile.photoSuccess,
        });

        setTimeout(() => {
            resetModal();
            onClose();
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl border border-cyan-500/20 bg-[#0f1115] shadow-[0_0_40px_rgba(34,211,238,0.10)] overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                            <ImagePlus size={20} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Modifier la photo de profil
                            </h2>
                            <p className="text-sm text-gray-400">
                                Glissez une image ou sélectionnez un fichier
                            </p>
                        </div>
                    </div>

                    {feedback && (
                        <div className="px-6 pt-5">
                            <FeedbackMessage
                                type={feedback.type}
                                message={feedback.message}
                            />
                        </div>
                    )}

                    <button
                        onClick={handleClose}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => inputRef.current?.click()}
                        className={`flex min-h-55 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
                            isDragging
                                ? "border-cyan-400 bg-cyan-500/10"
                                : "border-white/10 bg-white/3 hover:border-cyan-400/50 hover:bg-cyan-500/5"
                        }`}
                    >
                        {preview ? (
                            <div className="flex flex-col items-center gap-4">
                                <img
                                    src={preview}
                                    alt="Aperçu"
                                    className="h-28 w-28 rounded-full object-cover border-2 border-cyan-400 shadow-lg"
                                />
                                <p className="text-sm text-gray-300">
                                    {selectedFile?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Cliquez ou glissez une autre image pour
                                    remplacer
                                </p>
                            </div>
                        ) : (
                            <>
                                <Upload
                                    size={34}
                                    className="mb-3 text-cyan-400"
                                />
                                <p className="text-sm font-medium text-white">
                                    Glissez-déposez votre image ici
                                </p>
                                <p className="mt-2 text-sm text-gray-400">
                                    ou cliquez pour ouvrir le sélecteur de
                                    fichier
                                </p>
                                <p className="mt-3 text-xs text-gray-500">
                                    PNG, JPG, JPEG, WEBP
                                </p>
                            </>
                        )}

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="hidden"
                            aria-label="Importer une image"
                        />
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                        >
                            Annuler
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!selectedFile}
                            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Valider
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePhotoModal;

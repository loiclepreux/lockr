import { useState } from "react";
import FeedbackMessage from "../ui/FeedbackMessage";
import { feedbackMessages } from "../../types/feedbackMessage";
import { useCreateGroup } from "../../hooks/useGroups";
import type { PrivacyEnum } from "../../types/IGroup";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateGroupModal({
    isOpen,
    onClose,
}: CreateGroupModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [privacy, setPrivacy] = useState<PrivacyEnum>("public");
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const { mutateAsync: createGroup, isPending } = useCreateGroup();

    const handleConfirm = async () => {
        setFeedback(null);

        // Validation des champs obligatoires
        if (!name.trim()) {
            setFeedback({
                type: "error",
                message: feedbackMessages.group.emptyName,
            });
            return;
        }

        if (!description.trim()) {
            setFeedback({
                type: "error",
                message: feedbackMessages.group.emptyDescription,
            });
            return;
        }

        if (!category.trim()) {
            setFeedback({
                type: "error",
                message: feedbackMessages.group.emptyCategory,
            });
            return;
        }

        try {
            // On envoie le groupe avec ses membres d'un seul coup
            await createGroup({ name, description, category, privacy });

            setFeedback({
                type: "success",
                message: feedbackMessages.group.createSuccess,
            });

            // Petit délai pour que l'utilisateur voie le message de succès
            setTimeout(() => {
                handleClose();
            }, 1200);
        } catch (error) {
            console.error(error);
            setFeedback({
                type: "error",
                message: feedbackMessages.group.createError,
            });
        }
    };

    const handleClose = () => {
        setName("");
        setDescription("");
        setCategory("");
        setPrivacy("public");
        setFeedback(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <dialog open className="modal">
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-box max-w-lg bg-[#0f1115] text-white border border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.08)] rounded-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <h2 className="text-xl font-bold tracking-wide">
                        Créer un groupe
                    </h2>
                    <button
                        onClick={handleClose}
                        className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white hover:bg-red-500 transition-all duration-300 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {feedback && (
                    <div className="mb-5">
                        <FeedbackMessage
                            type={feedback.type}
                            message={feedback.message}
                        />
                    </div>
                )}

                <div className="flex flex-col gap-5">
                    {/* Nom */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="group-name"
                            className="text-gray-400 text-xs uppercase tracking-widest"
                        >
                            Nom du groupe
                        </label>
                        <input
                            id="group-name"
                            type="text"
                            placeholder="Ex: Projet S6"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered w-full bg-white/3 border-cyan-500/20 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none transition-all duration-200"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="group-description"
                            className="text-gray-400 text-xs uppercase tracking-widest"
                        >
                            Description
                        </label>
                        <textarea
                            id="group-description"
                            placeholder="Ex: Groupe de travail pour le projet S6"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="textarea textarea-bordered w-full bg-white/3 border-cyan-500/20 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none transition-all duration-200 resize-none h-24"
                        />
                    </div>

                    {/* Catégorie */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="group-category"
                            className="text-gray-400 text-xs uppercase tracking-widest"
                        >
                            Catégorie
                        </label>
                        <input
                            id="group-category"
                            type="text"
                            placeholder="Ex: Travail, Personnel, Études..."
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input input-bordered w-full bg-white/3 border-cyan-500/20 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none transition-all duration-200"
                        />
                    </div>

                    {/* Confidentialité */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs uppercase tracking-widest">
                            Confidentialité
                        </label>
                        <div className="flex gap-3">
                            {(["public", "private"] as PrivacyEnum[]).map(
                                (option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setPrivacy(option)}
                                        className={`flex-1 py-3 rounded-xl border transition-all duration-200 text-sm font-medium cursor-pointer ${
                                            privacy === option
                                                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                                                : "bg-white/3 border-cyan-500/20 text-gray-400 hover:border-cyan-500/40"
                                        }`}
                                    >
                                        {option === "public"
                                            ? "🌐 Public"
                                            : "🔒 Privé"}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <button
                        onClick={handleClose}
                        className="px-5 py-3 rounded-xl border border-cyan-500/20 text-gray-400 hover:text-white hover:border-cyan-500/50 transition-all duration-300 cursor-pointer"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isPending}
                        className="px-5 py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Création..." : "Créer"}
                    </button>
                </div>
            </div>
        </dialog>
    );
}

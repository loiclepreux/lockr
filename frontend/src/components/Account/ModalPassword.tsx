import { KeyRound, Lock, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import FeedbackMessage from "../ui/FeedbackMessage";
import { feedbackMessages } from "../../types/feedbackMessage";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => void;
}

const ChangePasswordModal = ({
    isOpen,
    onClose,
    onSubmit,
}: ChangePasswordModalProps) => {
    // champs du formulaire
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // gere message success/error
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        // vérif des champs
        if (!currentPassword || !newPassword || !confirmPassword) {
            setFeedback({
                type: "error",
                message: feedbackMessages.password.emptyPassword,
            });
            return;
        }

        // vérif de la longueur du MDP
        if (newPassword.length < 8) {
            setFeedback({
                type: "error",
                message: feedbackMessages.password.passwordLength,
            });
            return;
        }

        // confirmation du MDP
        if (newPassword !== confirmPassword) {
            setFeedback({
                type: "error",
                message: feedbackMessages.password.passwordConfirm,
            });
            return;
        }

        try {
            if (onSubmit) {
                onSubmit({
                    currentPassword,
                    newPassword,
                    confirmPassword,
                });
            }

            // succés du changement
            setFeedback({
                type: "success",
                message: feedbackMessages.password.passwordSuccess,
            });
        } catch (error) {
            console.error(error);
            setFeedback({
                type: "error",
                message: feedbackMessages.password.passwordError,
            });
        }

        // reset et fermeture auto
        setTimeout(() => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            onClose();
        }, 1200);
    };

    //fermeture et reset complet des champs et feedback
    const handleClose = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setFeedback(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg rounded-2xl border border-cyan-500/20 bg-[#0f1115] shadow-[0_0_40px_rgba(34,211,238,0.12)] overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Changer le mot de passe
                            </h2>
                            <p className="text-sm text-gray-400">
                                Mettez à jour vos identifiants en toute sécurité
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
                        aria-label="Fermer la fenêtre"
                    >
                        <X size={20} />
                    </button>
                </div>

                {feedback && (
                    <div className="px-6 pt-5">
                        <FeedbackMessage
                            type={feedback.type}
                            message={feedback.message}
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="px-6 py-5">
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Mot de passe actuel
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
                                />
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                    placeholder="Entrez votre mot de passe actuel"
                                    className="w-full rounded-xl border border-white/10 bg-white/3 py-3 pl-10 pr-4 text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Nouveau mot de passe
                            </label>
                            <div className="relative">
                                <KeyRound
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
                                />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    placeholder="Entrez le nouveau mot de passe"
                                    className="w-full rounded-xl border border-white/10 bg-white/3 py-3 pl-10 pr-4 text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Confirmation du mot de passe
                            </label>
                            <div className="relative">
                                <ShieldCheck
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
                                />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Confirmez le nouveau mot de passe"
                                    className="w-full rounded-xl border border-white/10 bg-white/3 py-3 pl-10 pr-4 text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
                        >
                            Valider
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;

import { Mail, MapPin, Pencil, Phone, X } from "lucide-react";
import { useState } from "react";
import FeedbackMessage from "../ui/FeedbackMessage";
import { feedbackMessages } from "../../types/feedbackMessage";

interface EditProfileModalProps {
    onClose: () => void;
    user: {
        email: string;
        telephone: string;
        adresse: string;
    };
    onSubmit: (data: {
        email: string;
        telephone: string;
        adresse: string;
    }) => void;
}

const EditProfileModal = ({
    onClose,
    user,
    onSubmit,
}: EditProfileModalProps) => {
    const [email, setEmail] = useState(user.email || "");
    const [telephone, setTelephone] = useState(user.telephone || "");
    const [adresse, setAdresse] = useState(user.adresse || "");

    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const handleClose = () => {
        setFeedback(null);
        onClose();
    };

    // error and success messages for profile update.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        if (!telephone.trim()) {
            setFeedback({
                type: "error",
                message: feedbackMessages.profile.phoneObligatory,
            });
            return;
        }

        if (!adresse.trim()) {
            setFeedback({
                type: "error",
                message: feedbackMessages.profile.adressObligatory,
            });
            return;
        }

        if (!email.trim()) {
            setFeedback({
                type: "error",
                message: feedbackMessages.profile.emailObligatory,
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setFeedback({
                type: "error",
                message: feedbackMessages.profile.emailValidate,
            });
            return;
        }

        try {
            onSubmit({
                email,
                telephone,
                adresse,
            });

            console.log("Données soumises :", { email, telephone, adresse });
            console.log(
                "feedbackMessages :",
                feedbackMessages.profile.updateSuccess,
            );
            setFeedback({
                type: "success",
                message: feedbackMessages.profile.updateSuccess,
            });

            setTimeout(() => {
                setFeedback(null);
                onClose();
            }, 1200);
        } catch (error) {
            console.error(error);

            setFeedback({
                type: "error",
                message: feedbackMessages.profile.updateError,
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#0f1115] shadow-[0_0_40px_rgba(34,211,238,0.12)]">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                            <Pencil size={20} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Modifier le profil
                            </h2>
                            <p className="text-sm text-gray-400">
                                Mettez à jour vos informations personnelles
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
                        aria-label="Fermer"
                    >
                        <X size={18} />
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
                                Téléphone
                            </label>
                            <div className="relative">
                                <Phone
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
                                />
                                <input
                                    type="text"
                                    value={telephone}
                                    onChange={(e) =>
                                        setTelephone(e.target.value)
                                    }
                                    placeholder="Entrez votre numéro"
                                    className="w-full rounded-xl border border-white/10 bg-white/3 py-3 pl-10 pr-4 text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Adresse
                            </label>
                            <div className="relative">
                                <MapPin
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
                                />
                                <input
                                    type="text"
                                    value={adresse}
                                    onChange={(e) => setAdresse(e.target.value)}
                                    placeholder="Entrez votre adresse"
                                    className="w-full rounded-xl border border-white/10 bg-white/3 py-3 pl-10 pr-4 text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Entrez votre email"
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

export default EditProfileModal;

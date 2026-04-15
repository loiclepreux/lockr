import { useState } from "react";
import FeedbackMessage from "../ui/FeedbackMessage";
import { feedbackMessages } from "../../types/feedbackMessage";
import { useCreateGroup } from "../../hooks/useGroups";
import type { IGroupMember } from "../../types/IGroup";

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
    const [type, setType] = useState("Personnel");
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    // ── Membres : liste locale construite avant soumission ──────────────────
    // Les membres n'ont pas encore d'id ici — c'est le serveur qui les génère.
    // On stocke juste les infos saisies en attendant.
    const [members, setMembers] = useState<Omit<IGroupMember, "id">[]>([]);
    const [memberFirstName, setMemberFirstName] = useState("");
    const [memberLastName, setMemberLastName] = useState("");
    const [memberEmail, setMemberEmail] = useState("");

    // Le hook mutation — mutateAsync nous donne une Promise qu'on peut await
    const { mutateAsync: createGroup, isPending } = useCreateGroup();

    // ── Ajouter un membre à la liste locale ─────────────────────────────────
    const handleAddMember = () => {
        if (
            !memberFirstName.trim() ||
            !memberLastName.trim() ||
            !memberEmail.trim()
        )
            return;

        setMembers((prev) => [
            ...prev,
            {
                firstName: memberFirstName,
                lastName: memberLastName,
                email: memberEmail,
            },
        ]);

        // On vide les champs du mini-formulaire après ajout
        setMemberFirstName("");
        setMemberLastName("");
        setMemberEmail("");
    };

    const handleRemoveMember = (index: number) => {
        setMembers((prev) => prev.filter((_, i) => i !== index));
    };

    const handleConfirm = async () => {
        setFeedback(null);

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

        try {
            // On envoie le groupe avec ses membres d'un seul coup
            await createGroup({ name, description, members });

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
        setType("Personnel");
        setMembers([]);
        setMemberFirstName("");
        setMemberLastName("");
        setMemberEmail("");
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
                    {/* Nom du groupe */}
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
                            className="input input-bordered w-full bg-white/3 border-cyan-500/20 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none transition-all duration-200 cursor-text"
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
                            className="textarea textarea-bordered w-full bg-white/3 border-cyan-500/20 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none transition-all duration-200 resize-none h-24 cursor-text"
                        />
                    </div>

                    {/* Type — dropdown DaisyUI pour éviter le menu natif du navigateur */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs uppercase tracking-widest">
                            Type
                        </label>
                        <div className="dropdown w-full">
                            <div
                                tabIndex={0}
                                role="button"
                                className="flex items-center justify-between w-full bg-white/3 border border-cyan-500/20 rounded-xl px-4 py-3 text-white cursor-pointer hover:border-cyan-500/50 transition-all duration-200"
                            >
                                <span>{type}</span>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-50 menu w-full bg-[#0f1115] border border-cyan-500/20 rounded-xl shadow-xl mt-1 p-1"
                            >
                                {["Personnel", "Professionnel"].map(
                                    (option) => (
                                        <li key={option}>
                                            <button
                                                onClick={() => {
                                                    setType(option);
                                                    (
                                                        document.activeElement as HTMLElement
                                                    )?.blur();
                                                }}
                                                className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                                                    type === option
                                                        ? "bg-cyan-500/20 text-cyan-300"
                                                        : "text-gray-300 hover:bg-cyan-500/10"
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Image du groupe */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="group-image"
                            className="text-gray-400 text-xs uppercase tracking-widest"
                        >
                            Image du groupe
                        </label>
                        <label
                            htmlFor="group-image"
                            className="flex items-center gap-4 bg-white/3 border border-cyan-500/20 border-dashed rounded-xl px-4 py-4 cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-300 group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors shrink-0">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <polyline points="16 16 12 12 8 16" />
                                    <line x1="12" y1="12" x2="12" y2="21" />
                                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-300 text-sm font-medium">
                                    Choisir une image
                                </p>
                                <p className="text-gray-500 text-xs mt-0.5">
                                    PNG, JPG — max 5MB
                                </p>
                            </div>
                            <input
                                id="group-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* ── Section membres ─────────────────────────────────────────────────── */}
                    <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
                        <label className="text-gray-400 text-xs uppercase tracking-widest">
                            Membres ({members.length})
                        </label>

                        {/* Liste des membres déjà ajoutés */}
                        {members.length > 0 && (
                            <div className="flex flex-col gap-2">
                                {members.map((member, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-white/3 border border-cyan-500/10 rounded-xl px-4 py-2"
                                    >
                                        <span className="text-sm text-gray-300">
                                            {member.firstName} {member.lastName}
                                            <span className="text-gray-500 ml-2">
                                                — {member.email}
                                            </span>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveMember(index)
                                            }
                                            className="text-gray-500 hover:text-red-400 transition-colors text-xs cursor-pointer"
                                        >
                                            Retirer
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Mini-formulaire d'ajout */}
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Prénom"
                                    value={memberFirstName}
                                    onChange={(e) =>
                                        setMemberFirstName(e.target.value)
                                    }
                                    className="input input-bordered input-sm flex-1 bg-white/3 border-cyan-500/20 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    value={memberLastName}
                                    onChange={(e) =>
                                        setMemberLastName(e.target.value)
                                    }
                                    className="input input-bordered input-sm flex-1 bg-white/3 border-cyan-500/20 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={memberEmail}
                                    onChange={(e) =>
                                        setMemberEmail(e.target.value)
                                    }
                                    // Permet d'ajouter le membre en appuyant sur Entrée
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddMember();
                                        }
                                    }}
                                    className="input input-bordered input-sm flex-1 bg-white/3 border-cyan-500/20 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddMember}
                                    className="px-4 py-1 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200 text-sm cursor-pointer"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Boutons d'action — même style que la modal notifications */}
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
                        className="px-5 py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-all duration-300 cursor-pointer"
                    >
                        {isPending ? "Création..." : "Créer"}
                    </button>
                </div>
            </div>
        </dialog>
    );
}

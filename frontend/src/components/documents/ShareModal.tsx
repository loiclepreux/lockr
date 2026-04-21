import {
    Share2,
    X,
    User,
    Clock,
    Infinity,
    Settings2,
    Plus,
    ChevronRight,
    Trash2,
} from "lucide-react";
import FeedbackMessage from "../ui/FeedbackMessage";

interface AccessUser {
    email: string;
    initials: string;
    expiry: string | null;
}

interface AccessGroup {
    id: string;
    name: string;
    expiry: string | null;
}

interface ShareModalState {
    selectedDoc: { name: string } | null;
    feedback: { type: "success" | "error"; message: string } | null;
    selectedUsers: string[];
    emailInput: string;
    suggestedUsers: string[];
    existingAccess: AccessUser[];
    selectedGroupId: string;
    existingGroupAccess: AccessGroup[];
    groups: { id: number; name: string }[];
}

interface ShareModalActions {
    setEmailInput: (val: string) => void;
    setExistingAccess: (users: AccessUser[]) => void;
    removeUser: (user: string) => void;
    addUser: (user: string) => void;
    confirmShare: () => void;
    setSelectedGroupId: (val: string) => void;
    setExistingGroupAccess: (groups: AccessGroup[]) => void;
    addGroup: () => void;
}

interface ShareModalProps {
    state: ShareModalState;
    actions: ShareModalActions;
}

export function ShareModal({ state, actions }: ShareModalProps) {
    const {
        selectedDoc,
        feedback,
        selectedUsers,
        emailInput,
        suggestedUsers,
        existingAccess,
        selectedGroupId,
        existingGroupAccess,
        groups,
    } = state;
    const {
        setEmailInput,
        setExistingAccess,
        removeUser,
        addUser,
        confirmShare,
        setSelectedGroupId,
        setExistingGroupAccess,
        addGroup,
    } = actions;

    return (
        <dialog
            id="share_modal"
            className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
        >
            <div className="w-full max-w-2xl overflow-visible rounded-2xl border border-cyan-500/10 bg-[#111318] p-5 text-white shadow-[0_0_40px_rgba(0,255,255,0.05)] sm:p-8">
                <div className="mb-6 flex items-start gap-3">
                    <div className="mt-1 text-emerald-400">
                        <Share2 size={24} />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-xl font-bold">
                            Partager le document
                        </h3>
                        <p className="mt-1 break-all text-sm text-gray-400">
                            {selectedDoc?.name}
                        </p>
                    </div>
                </div>

                {feedback && (
                    <div className="mb-5">
                        <FeedbackMessage
                            type={feedback.type}
                            message={feedback.message}
                        />
                    </div>
                )}

                <div className="relative">
                    <label className="mb-3 block text-[11px] uppercase tracking-[0.18em] text-gray-400">
                        Inviter des personnes
                    </label>

                    <div className="flex flex-wrap gap-2 rounded-xl border border-cyan-500/10 bg-[#0f1115] p-3 transition focus-within:border-cyan-400">
                        {selectedUsers.map((user) => (
                            <div
                                key={user}
                                className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-300"
                            >
                                <span>{user}</span>
                                <X
                                    size={14}
                                    className="cursor-pointer transition hover:text-white"
                                    onClick={() => removeUser(user)}
                                />
                            </div>
                        ))}

                        <input
                            type="text"
                            placeholder="Saisissez un email..."
                            className="min-w-[180px] flex-1 bg-transparent text-white outline-none placeholder:text-gray-500"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                    </div>

                    {suggestedUsers.length > 0 && (
                        <ul className="absolute left-0 top-[100%] z-[100] mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-cyan-500/10 bg-[#111318] shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
                            {suggestedUsers.map((user) => (
                                <li
                                    key={user}
                                    className="cursor-pointer px-4 py-3 transition hover:bg-cyan-500/5"
                                    onClick={() => addUser(user)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                                            <User size={18} />
                                        </div>
                                        <span className="text-sm font-medium text-white">
                                            {user}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-8">
                    <label className="mb-3 block text-[11px] uppercase tracking-[0.18em] text-gray-400">
                        Partager à un groupe
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <select
                            value={selectedGroupId}
                            onChange={(e) => setSelectedGroupId(e.target.value)}
                            className="w-full rounded-xl border border-cyan-500/10 bg-[#0f1115] px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                        >
                            <option value="">Sélectionnez un groupe</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={addGroup}
                            className="rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-black transition hover:bg-cyan-400"
                        >
                            Ajouter
                        </button>
                    </div>
                </div>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                        Utilisateurs avec accès
                    </span>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between rounded-2xl border border-cyan-500/10 bg-[#0f1115] p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                                Moi
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-white">
                                    Vous
                                </p>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-400">
                                    Propriétaire
                                </p>
                            </div>
                        </div>
                    </div>

                    {existingAccess.map((user) => (
                        <div
                            key={user.email}
                            className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#0f1115] p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-400">
                                    {user.initials}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-white">
                                        {user.email}
                                    </p>

                                    <p
                                        className={`mt-1 flex items-center gap-1 text-[11px] ${
                                            user.expiry
                                                ? "text-orange-400"
                                                : "text-cyan-400"
                                        }`}
                                    >
                                        {user.expiry ? (
                                            <>
                                                <Clock size={11} />
                                                Expire dans {user.expiry}
                                            </>
                                        ) : (
                                            <>
                                                <Infinity size={11} />
                                                Accès indéfini
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="dropdown dropdown-end">
                                <label
                                    tabIndex={0}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 transition hover:bg-cyan-500/20"
                                >
                                    <Settings2 size={14} />
                                    Gérer l'accès
                                </label>

                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[110] mt-2 w-64 rounded-2xl border border-cyan-500/10 bg-[#111318] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
                                >
                                    <li className="dropdown dropdown-left dropdown-hover">
                                        <div
                                            tabIndex={0}
                                            role="button"
                                            className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm text-white hover:bg-cyan-500/5"
                                        >
                                            <div className="flex items-center gap-2 text-emerald-400">
                                                <Plus size={16} />
                                                Ajouter une période
                                            </div>
                                            <ChevronRight size={14} />
                                        </div>

                                        <ul
                                            tabIndex={0}
                                            className="dropdown-content z-[120] mr-2 w-40 rounded-2xl border border-cyan-500/10 bg-[#111318] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
                                        >
                                            <li>
                                                <button
                                                    type="button"
                                                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-cyan-500/5"
                                                    onClick={() =>
                                                        setExistingAccess(
                                                            existingAccess.map(
                                                                (u) =>
                                                                    u.email ===
                                                                    user.email
                                                                        ? {
                                                                              ...u,
                                                                              expiry: "1 heure",
                                                                          }
                                                                        : u,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    + 1 heure
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-cyan-500/5"
                                                    onClick={() =>
                                                        setExistingAccess(
                                                            existingAccess.map(
                                                                (u) =>
                                                                    u.email ===
                                                                    user.email
                                                                        ? {
                                                                              ...u,
                                                                              expiry: "24 heures",
                                                                          }
                                                                        : u,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    + 1 jour
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-cyan-500/5"
                                                    onClick={() =>
                                                        setExistingAccess(
                                                            existingAccess.map(
                                                                (u) =>
                                                                    u.email ===
                                                                    user.email
                                                                        ? {
                                                                              ...u,
                                                                              expiry: "7 jours",
                                                                          }
                                                                        : u,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    + 1 semaine
                                                </button>
                                            </li>
                                        </ul>
                                    </li>

                                    <li>
                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm text-cyan-400 hover:bg-cyan-500/5"
                                            onClick={() => {
                                                setExistingAccess(
                                                    existingAccess.map((u) =>
                                                        u.email === user.email
                                                            ? {
                                                                  ...u,
                                                                  expiry: null,
                                                              }
                                                            : u,
                                                    ),
                                                );
                                            }}
                                        >
                                            <Infinity size={16} />
                                            Rendre indéfini
                                        </button>
                                    </li>

                                    <div className="mx-3 h-px bg-white/5" />

                                    <li>
                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm text-red-400 hover:bg-red-500/10"
                                            onClick={() => {
                                                setExistingAccess(
                                                    existingAccess.filter(
                                                        (u) =>
                                                            u.email !==
                                                            user.email,
                                                    ),
                                                );
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            Supprimer l'accès
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                        Groupes avec accès
                    </span>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="space-y-4">
                    {existingGroupAccess.map((group) => (
                        <div
                            key={group.id}
                            className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#0f1115] p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-xs font-bold text-cyan-400">
                                    {group.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-white">
                                        {group.name}
                                    </p>

                                    <p
                                        className={`mt-1 flex items-center gap-1 text-[11px] ${
                                            group.expiry
                                                ? "text-orange-400"
                                                : "text-cyan-400"
                                        }`}
                                    >
                                        {group.expiry
                                            ? `Expire dans ${group.expiry}`
                                            : "Accès indéfini"}
                                    </p>
                                </div>
                            </div>

                            <div className="dropdown dropdown-end">
                                <label
                                    tabIndex={0}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 transition hover:bg-cyan-500/20"
                                >
                                    Gérer l'accès
                                </label>

                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[110] mt-2 w-64 rounded-2xl border border-cyan-500/10 bg-[#111318] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
                                >
                                    <li>
                                        <button
                                            type="button"
                                            className="w-full rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-cyan-500/5"
                                            onClick={() =>
                                                setExistingGroupAccess(
                                                    existingGroupAccess.map(
                                                        (g) =>
                                                            g.id === group.id
                                                                ? {
                                                                      ...g,
                                                                      expiry: "1 heure",
                                                                  }
                                                                : g,
                                                    ),
                                                )
                                            }
                                        >
                                            + 1 heure
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            type="button"
                                            className="w-full rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-cyan-500/5"
                                            onClick={() =>
                                                setExistingGroupAccess(
                                                    existingGroupAccess.map(
                                                        (g) =>
                                                            g.id === group.id
                                                                ? {
                                                                      ...g,
                                                                      expiry: "24 heures",
                                                                  }
                                                                : g,
                                                    ),
                                                )
                                            }
                                        >
                                            + 1 jour
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            type="button"
                                            className="w-full rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-cyan-500/5"
                                            onClick={() =>
                                                setExistingGroupAccess(
                                                    existingGroupAccess.map(
                                                        (g) =>
                                                            g.id === group.id
                                                                ? {
                                                                      ...g,
                                                                      expiry: "7 jours",
                                                                  }
                                                                : g,
                                                    ),
                                                )
                                            }
                                        >
                                            + 1 semaine
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            type="button"
                                            className="w-full rounded-xl px-3 py-2 text-left text-sm text-cyan-400 hover:bg-cyan-500/5"
                                            onClick={() =>
                                                setExistingGroupAccess(
                                                    existingGroupAccess.map(
                                                        (g) =>
                                                            g.id === group.id
                                                                ? {
                                                                      ...g,
                                                                      expiry: null,
                                                                  }
                                                                : g,
                                                    ),
                                                )
                                            }
                                        >
                                            Rendre indéfini
                                        </button>
                                    </li>

                                    <div className="mx-3 h-px bg-white/5" />

                                    <li>
                                        <button
                                            type="button"
                                            className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                                            onClick={() =>
                                                setExistingGroupAccess(
                                                    existingGroupAccess.filter(
                                                        (g) =>
                                                            g.id !== group.id,
                                                    ),
                                                )
                                            }
                                        >
                                            Supprimer l'accès
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <form method="dialog">
                        <button className="w-full rounded-xl border border-white/10 px-4 py-2 text-gray-300 transition hover:bg-white/5 sm:w-auto">
                            Fermer
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={confirmShare}
                        className="w-full rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-black transition hover:bg-cyan-400 sm:w-auto"
                    >
                        Enregistrer
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop bg-black/50">
                <button>fermer</button>
            </form>
        </dialog>
    );
}

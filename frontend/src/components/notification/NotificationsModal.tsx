import { Link } from "react-router-dom";

type Notification = {
    id: number;
    title: string;
    message: string;
    time: string;
};

const notifications: Notification[] = [
    {
        id: 1,
        title: "Nouveau document partagé",
        message: "Sarah a partagé un document avec vous.",
        time: "Il y a 2 min",
    },
    {
        id: 2,
        title: "Connexion détectée",
        message: "Une nouvelle connexion à votre compte a été détectée.",
        time: "Il y a 10 min",
    },
    {
        id: 3,
        title: "Groupe mis à jour",
        message: "Le groupe 'Projet Alpha' a reçu une nouvelle mise à jour.",
        time: "Il y a 25 min",
    },
    {
        id: 4,
        title: "Stockage presque plein",
        message: "Vous avez utilisé 85% de votre espace disponible.",
        time: "Il y a 1 h",
    },
    {
        id: 5,
        title: "Mot de passe modifié",
        message: "Votre mot de passe a été mis à jour avec succès.",
        time: "Il y a 3 h",
    },
];

export default function NotificationsModal() {
    return (
        <dialog id="notifications_modal" className="modal">
            <div className="modal-box max-w-2xl bg-[#0f1115] text-white border border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.08)] rounded-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <h2 className="text-2xl font-bold tracking-wide">
                        Notifications
                    </h2>

                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-red-600 transition-all duration-300">
                            ✕
                        </button>
                    </form>
                </div>

                <div className="max-h-80 overflow-y-auto pr-2 space-y-3">
                    {notifications.map((notif) => (
                        <label
                            key={notif.id}
                            className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-cyan-500/5 transition-all duration-300 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                className="checkbox checkbox-sm checkbox-info mt-1"
                            />

                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-base font-semibold text-white">
                                        {notif.title}
                                    </h3>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {notif.time}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                                    {notif.message}
                                </p>
                            </div>
                        </label>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <button className="px-5 py-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300">
                        Marquer comme lu
                    </button>

                    <Link to="/notifications">
                        <button className="px-5 py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-all duration-300">
                            Afficher les notifications
                        </button>
                    </Link>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}

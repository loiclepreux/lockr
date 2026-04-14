import { useState } from "react";
import { Trash2, Eye } from "lucide-react";

type Notification = {
    id: number;
    title: string;
    message: string;
    date: string;
    isRead: boolean;
};

export default function NotificationsCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            title: "Nouveau document partagé",
            message: "Sarah a partagé un document avec vous.",
            date: "2026-03-09 10:45",
            isRead: false,
        },
        {
            id: 2,
            title: "Connexion détectée",
            message: "Une nouvelle connexion a été détectée sur votre compte.",
            date: "2026-03-09 09:15",
            isRead: false,
        },
        {
            id: 3,
            title: "Mise à jour du groupe",
            message: "Le groupe Projet Alpha a été mis à jour.",
            date: "2026-03-08 18:30",
            isRead: true,
        },
        {
            id: 4,
            title: "Stockage presque plein",
            message: "Vous avez utilisé 85% de votre espace.",
            date: "2026-03-08 14:10",
            isRead: true,
        },
        {
            id: 5,
            title: "Mot de passe modifié",
            message: "Votre mot de passe a bien été modifié.",
            date: "2026-03-07 21:00",
            isRead: true,
        },
    ]);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleCheck = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((notifId) => notifId !== id)
                : [...prev, id],
        );
    };

    const handleDeleteSelected = () => {
        setNotifications((prev) =>
            prev.filter((notif) => !selectedIds.includes(notif.id)),
        );
        setSelectedIds([]);
    };

    return (
        <div className="bg-[#0f1115] border border-cyan-500/10 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.04)] p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-wide text-white">
                        Toutes les notifications
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Consultez et gérez l’ensemble de vos notifications.
                    </p>
                </div>

                <button
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.length === 0}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Trash2 size={18} />
                    <span>Supprimer la sélection</span>
                </button>
            </div>

            {/* Liste */}
            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`rounded-2xl border p-4 transition-all duration-300 ${
                            notif.isRead
                                ? "border-white/5 bg-white/[0.02]"
                                : "border-cyan-500/20 bg-cyan-500/[0.04]"
                        }`}
                    >
                        <div className="flex items-start gap-4">
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(notif.id)}
                                onChange={() => handleCheck(notif.id)}
                                className="checkbox checkbox-info mt-1"
                            />

                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-white">
                                            {notif.title}
                                        </h3>

                                        {!notif.isRead && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                                                Non lu
                                            </span>
                                        )}
                                    </div>

                                    <span className="text-sm text-gray-400">
                                        {notif.date}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                                    {notif.message}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300">
                                        <Eye size={18} />
                                        <span>Consulter</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle } from "lucide-react";
import { NotificationsApi } from "../../api/notifications.api";

export default function NotificationCenter() {
    const queryClient = useQueryClient();

    // =========================
    // Récupération notifications
    // =========================
    const {
        data: notifications = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["notifications"],
        queryFn: NotificationsApi.findAll,
    });

    // =========================
    // Marquer UNE notification comme lue
    // =========================
    const markAsReadMutation = useMutation({
        mutationFn: (notificationId: string) =>
            NotificationsApi.markAsRead(notificationId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
        },
    });

    // =========================
    // Marquer TOUTES comme lues
    // =========================
    const markAllAsReadMutation = useMutation({
        mutationFn: NotificationsApi.markAllAsRead,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
        },
    });

    // =========================
    // Etats de chargement / erreur
    // =========================
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10">
                <p className="text-gray-400">Chargement des notifications...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center py-10">
                <p className="text-red-500">
                    Impossible de charger les notifications.
                </p>
            </div>
        );
    }

    // =========================
    // Comptage non lues
    // =========================
    const unreadCount = notifications.filter((item) => !item.isRead).length;

    return (
        <div className="space-y-6">
            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Bell className="h-6 w-6 text-blue-500" />

                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Notifications
                        </h2>

                        <p className="text-sm text-gray-400">
                            {unreadCount} non lue(s)
                        </p>
                    </div>
                </div>

                {notifications.length > 0 && unreadCount > 0 && (
                    <button
                        onClick={() => markAllAsReadMutation.mutate()}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            {/* ========================= */}
            {/* LISTE */}
            {/* ========================= */}
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
                        <p className="text-gray-400">
                            Aucune notification disponible.
                        </p>
                    </div>
                ) : (
                    notifications.map((item) => (
                        <div
                            key={item.notificationId}
                            className={`
                                rounded-2xl border p-5 transition
                                ${
                                    item.isRead
                                        ? "border-zinc-800 bg-zinc-900/40 opacity-70"
                                        : "border-blue-500/40 bg-blue-500/10"
                                }
                            `}
                        >
                            <div className="flex items-start justify-between gap-4">
                                {/* CONTENU */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-white">
                                            {item.notification.type}
                                        </h3>

                                        {!item.isRead && (
                                            <span className="rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                                                Nouveau
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-300">
                                        {item.notification.message}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {new Date(
                                            item.notification.createdAt,
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                {/* ACTION */}
                                {!item.isRead && (
                                    <button
                                        onClick={() =>
                                            markAsReadMutation.mutate(
                                                item.notificationId,
                                            )
                                        }
                                        className="flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        Lu
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

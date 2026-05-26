import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsApi } from "../../api/notifications.api";

export default function NotificationsModal() {
    const queryClient = useQueryClient();

    const {
        data: notifications = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["notifications"],
        queryFn: NotificationsApi.findAll,
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: NotificationsApi.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

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
                    {isLoading && (
                        <p className="text-gray-400">
                            Chargement des notifications...
                        </p>
                    )}

                    {isError && (
                        <p className="text-red-400">
                            Impossible de charger les notifications.
                        </p>
                    )}

                    {!isLoading && notifications.length === 0 && (
                        <p className="text-gray-400">
                            Aucune notification disponible.
                        </p>
                    )}

                    {notifications.map((item) => (
                        <div
                            key={item.notificationId}
                            className={`
                                flex items-start gap-4 p-4 rounded-xl border transition-all duration-300
                                ${
                                    item.isRead
                                        ? "border-white/5 bg-white/[0.02] opacity-60"
                                        : "border-cyan-500/30 bg-cyan-500/5"
                                }
                            `}
                        >
                            <input
                                type="checkbox"
                                checked={item.isRead}
                                readOnly
                                className="checkbox checkbox-sm checkbox-info mt-1"
                            />

                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-base font-semibold text-white">
                                        {item.notification.type}
                                    </h3>

                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {new Date(
                                            item.notification.createdAt,
                                        ).toLocaleString()}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                                    {item.notification.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <button
                        onClick={() => markAllAsReadMutation.mutate()}
                        className="px-5 py-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300"
                    >
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

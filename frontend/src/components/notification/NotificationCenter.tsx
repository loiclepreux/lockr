import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle, XCircle } from "lucide-react";
import { NotificationsApi } from "../../api/notifications.api";
import { AccessRequestsApi } from "../../api/access-requests.api";

type AccessRequest = {
    id: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    message: string;
    targetType: string;
    createdAt: string;

    requester?: {
        email: string;
        profile?: {
            firstName?: string;
            lastName?: string;
            imgUrl?: string;
        };
    };
};

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

    const {
        data: accessRequests = [],
        isLoading: isAccessRequestsLoading,
        isError: isAccessRequestsError,
    } = useQuery<AccessRequest[]>({
        queryKey: ["access-requests"],
        queryFn: AccessRequestsApi.findAll,
    });

    const updateAccessRequestMutation = useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: string;
            status: "ACCEPTED" | "REJECTED";
        }) => AccessRequestsApi.updateStatus(id, status),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["access-requests"],
            });

            queryClient.invalidateQueries({ queryKey: ["notifications"] });

            queryClient.invalidateQueries({
                queryKey: ["notifications-count"],
            });
        },
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

            queryClient.invalidateQueries({
                queryKey: ["notifications-count"],
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

            queryClient.invalidateQueries({
                queryKey: ["notifications-count"],
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

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Demandes d'accès
                        </h2>
                        <p className="text-sm text-gray-400">
                            Gérez les demandes reçues pour vos documents ou
                            groupes.
                        </p>
                    </div>
                </div>

                {isAccessRequestsLoading && (
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
                        <p className="text-gray-400">
                            Chargement des demandes d'accès...
                        </p>
                    </div>
                )}

                {isAccessRequestsError && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
                        <p className="text-red-400">
                            Impossible de charger les demandes d'accès.
                        </p>
                    </div>
                )}

                {!isAccessRequestsLoading &&
                    !isAccessRequestsError &&
                    accessRequests.length === 0 && (
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
                            <p className="text-gray-400">
                                Aucune demande d'accès pour le moment.
                            </p>
                        </div>
                    )}

                {!isAccessRequestsLoading &&
                    !isAccessRequestsError &&
                    accessRequests.map((request) => {
                        const requesterName =
                            `${request.requester?.profile?.firstName ?? ""} ${
                                request.requester?.profile?.lastName ?? ""
                            }`.trim() ||
                            request.requester?.email ||
                            "Utilisateur inconnu";

                        const isPending = request.status === "PENDING";

                        return (
                            <div
                                key={request.id}
                                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-white">
                                            {requesterName}
                                        </h3>

                                        <p className="text-sm text-gray-300">
                                            {request.message}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Type : {request.targetType} —{" "}
                                            {new Date(
                                                request.createdAt,
                                            ).toLocaleString("fr-FR")}
                                        </p>

                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                                request.status === "PENDING"
                                                    ? "bg-yellow-500/10 text-yellow-400"
                                                    : request.status ===
                                                        "ACCEPTED"
                                                      ? "bg-green-500/10 text-green-400"
                                                      : "bg-red-500/10 text-red-400"
                                            }`}
                                        >
                                            {request.status === "PENDING"
                                                ? "En attente"
                                                : request.status === "ACCEPTED"
                                                  ? "Acceptée"
                                                  : "Refusée"}
                                        </span>
                                    </div>

                                    {isPending && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    updateAccessRequestMutation.mutate(
                                                        {
                                                            id: request.id,
                                                            status: "ACCEPTED",
                                                        },
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Accepter
                                            </button>

                                            <button
                                                onClick={() =>
                                                    updateAccessRequestMutation.mutate(
                                                        {
                                                            id: request.id,
                                                            status: "REJECTED",
                                                        },
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Refuser
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

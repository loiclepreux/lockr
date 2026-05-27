import { useQuery } from "@tanstack/react-query";
import { ActivityLogApi } from "../../api/activity-log.api";

type ActivityLogItem = {
    id: string;
    actionType: string;
    createdAt: string;
    user?: {
        email: string;
        profile?: {
            firstName?: string;
            lastName?: string;
        };
    };
    group?: {
        id: string;
        name: string;
    };
};

export default function RecentActivities() {
    const {
        data: activities = [],
        isLoading,
        isError,
    } = useQuery<ActivityLogItem[]>({
        queryKey: ["recent-activities"],
        queryFn: ActivityLogApi.getRecentActivities,
    });

    return (
        <div className="bg-dark-card rounded-xl p-6 border border-blue-950">
            <p className="text-xs text-blue-400/50 uppercase tracking-widest mb-1">
                Historique
            </p>

            <p className="text-slate-200 font-semibold mb-6">
                Activités récentes
            </p>

            {isLoading && (
                <p className="text-slate-500 text-sm">
                    Chargement des activités...
                </p>
            )}

            {isError && (
                <p className="text-red-400 text-sm">
                    Impossible de charger les activités récentes.
                </p>
            )}

            {!isLoading && !isError && activities.length === 0 && (
                <p className="text-slate-500 text-sm">
                    Aucune activité récente.
                </p>
            )}

            {!isLoading && !isError && activities.length > 0 && (
                <ul className="flex flex-col gap-4">
                    {activities.map((activity) => (
                        <li
                            key={activity.id}
                            className="flex items-start gap-4 border-b border-blue-950 pb-4 last:border-none last:pb-0"
                        >
                            <div className="mt-1 w-2 h-2 rounded-full bg-cyan-400 shrink-0" />

                            <div className="flex flex-col">
                                <span className="text-slate-300 text-sm">
                                    {formatActivityMessage(activity)}
                                </span>

                                <span className="text-slate-500 text-xs mt-1">
                                    {formatDate(activity.createdAt)}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function formatDate(date: string) {
    return new Date(date).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatActivityMessage(activity: ActivityLogItem) {
    const groupName = activity.group?.name ?? "un groupe";

    switch (activity.actionType) {
        case "JOIN_GROUP":
            return `Vous avez rejoint le groupe ${groupName}`;

        case "CREATE_GROUP":
            return `Vous avez créé le groupe ${groupName}`;

        case "LEAVE_GROUP":
            return `Vous avez quitté le groupe ${groupName}`;

        case "REMOVE_FROM_GROUP":
            return `Vous avez été expulsé du groupe ${groupName}`;

        case "UPLOAD_DOCUMENT":
            return "Vous avez ajouté un document";

        case "DELETE_DOCUMENT":
            return "Vous avez supprimé un document";

        case "SHARE_DOCUMENT":
            return "Vous avez partagé un document";

        default:
            return activity.actionType;
    }
}

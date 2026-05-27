import { useQuery } from "@tanstack/react-query";
import { DashboardApi } from "../../api/dashboard.api";
import { AuthApi } from "../../api/auth.api";

type DashboardStats = {
    totalDocuments: number;
    totalGroups: number;
    totalSharedDocuments: number;
    unreadNotifications: number;
    recentActivitiesCount: number;
};

export default function HeroBanner() {
    const { data: meResponse } = useQuery({
        queryKey: ["me"],
        queryFn: AuthApi.me,
    });

    const {
        data: stats,
        isLoading,
        isError,
    } = useQuery<DashboardStats>({
        queryKey: ["dashboard-stats"],
        queryFn: DashboardApi.getStats,
    });

    const displayName = meResponse?.data?.profile?.firstName ?? "Utilisateur";

    return (
        <div className="relative h-64 overflow-hidden bg-hero bg-cover bg-center">
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-b from-transparent to-gray-950" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-between px-12">
                {/* Left */}
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                        Tableau de bord
                    </p>

                    <h1 className="text-4xl font-bold text-white leading-tight">
                        Bonjour,{" "}
                        <span className="text-cyan-300">{displayName}</span>
                    </h1>

                    <p className="text-sm text-gray-400 mt-2">
                        Que souhaitez-vous faire aujourd'hui ?
                    </p>
                </div>

                {/* Right */}
                <div className="flex gap-10">
                    {isLoading && (
                        <p className="text-slate-400">Chargement...</p>
                    )}

                    {isError && (
                        <p className="text-red-400">Erreur de chargement.</p>
                    )}

                    {!isLoading &&
                        !isError &&
                        stats &&
                        [
                            {
                                value: stats.totalDocuments,
                                label: "Documents",
                            },
                            {
                                value: stats.totalGroups,
                                label: "Groupes",
                            },
                            {
                                value: stats.unreadNotifications,
                                label: "Notifs",
                            },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <div className="text-4xl font-extrabold text-white leading-none">
                                    {s.value}
                                </div>

                                <div className="text-xs text-gray-400 mt-1">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

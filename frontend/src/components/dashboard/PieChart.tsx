import {
    Legend,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { DashboardApi } from "../../api/dashboard.api";

interface FileTypeStat {
    name: string;
    value: number;
}

const COLORS: Record<string, string> = {
    PDF: "#2563eb",
    PNG: "#06b6d4",
    JPG: "#14b8a6",
    JPEG: "#14b8a6",
    DOCX: "#6366f1",
    MP3: "#0ea5e9",
    MP4: "#8b5cf6",
    WEBP: "#22c55e",
};

const renderLegend = (value: string) => (
    <span className="text-slate-500 text-xs">{value}</span>
);

export default function PieChart() {
    const {
        data: fileTypes = [],
        isLoading,
        isError,
    } = useQuery<FileTypeStat[]>({
        queryKey: ["documents-by-type"],
        queryFn: DashboardApi.getDocumentsByType,
    });

    const chartData = fileTypes.map((item) => ({
        ...item,
        fill: COLORS[item.name] ?? "#818cf8",
    }));

    return (
        <div className="bg-dark-card rounded-xl p-6 border border-blue-950">
            <p className="text-xs text-blue-400/50 uppercase tracking-widest mb-1">
                Fichiers
            </p>
            <p className="text-slate-200 font-semibold mb-6">
                Répartition par type de fichier
            </p>

            {isLoading && (
                <p className="text-slate-500 text-sm">
                    Chargement des statistiques...
                </p>
            )}

            {isError && (
                <p className="text-red-400 text-sm">
                    Impossible de charger les statistiques.
                </p>
            )}

            {!isLoading && !isError && (
                <ResponsiveContainer width="100%" height={260}>
                    <RechartsPieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={105}
                            paddingAngle={3}
                            dataKey="value"
                        />
                        <Tooltip />
                        <Legend formatter={renderLegend} />
                    </RechartsPieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

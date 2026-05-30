import { useQuery } from "@tanstack/react-query";
import { DashboardApi } from "../../api/dashboard.api";
import {
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface MonthlyImport {
    month: string;
    imports: number;
}

interface ParetoEntry extends MonthlyImport {
    cumul: number;
}

export default function ParetoChart() {
    const {
        data: monthlyImports = [],
        isLoading,
        isError,
    } = useQuery<MonthlyImport[]>({
        queryKey: ["monthly-imports"],
        queryFn: DashboardApi.getMonthlyImports,
    });

    const total = monthlyImports.reduce((sum, item) => sum + item.imports, 0);

    const paretoData: ParetoEntry[] = monthlyImports.map((item, index) => {
        const cumulValue = monthlyImports
            .slice(0, index + 1)
            .reduce((sum, current) => sum + current.imports, 0);

        return {
            ...item,
            cumul: total > 0 ? Math.round((cumulValue / total) * 100) : 0,
        };
    });

    return (
        <div className="bg-dark-card rounded-xl p-6 border border-blue-950">
            <p className="text-xs text-blue-400/50 uppercase tracking-widest mb-1">
                Importations
            </p>

            <p className="text-slate-200 font-semibold mb-6">
                Nombre d'importations par mois
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
                    <ComposedChart data={paretoData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#0d1f35" />

                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#334155", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            unit="%"
                            domain={[0, 100]}
                            tick={{ fill: "#334155", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip />

                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="cumul"
                            name="Cumulé"
                            stroke="#38bdf8"
                            strokeWidth={2}
                            dot={{ fill: "#38bdf8", r: 3 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

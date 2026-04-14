import {
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

interface ParetoEntry {
    month: string;
    imports: number;
    cumul: number;
}

const mockData = [
    { month: "Jan", imports: 12 },
    { month: "Fév", imports: 28 },
    { month: "Mar", imports: 18 },
    { month: "Avr", imports: 35 },
    { month: "Mai", imports: 22 },
    { month: "Juin", imports: 40 },
    { month: "Juil", imports: 30 }
];

const total = mockData.reduce((s, d) => s + d.imports, 0);
let cumul = 0;
const paretoData: ParetoEntry[] = mockData.map((d) => {
    cumul += d.imports;
    return { ...d, cumul: Math.round((cumul / total) * 100) };
});

export default function ParetoChart() {
    return (
        <div className="bg-dark-card rounded-xl p-6 border border-blue-950">
            <p className="text-xs text-blue-400/50 uppercase tracking-widest mb-1">Importations</p>
            <p className="text-slate-200 font-semibold mb-6">Nombre d'importations par mois</p>
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
        </div>
    );
}

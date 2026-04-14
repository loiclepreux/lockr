import { Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";

const mockData = [
    { name: "PDF", value: 40, fill: "#2563eb" }, // bleu vif
    { name: "PNG", value: 25, fill: "#06b6d4" }, // cyan
    { name: "DOCX", value: 20, fill: "#6366f1" }, // indigo
    { name: "MP3", value: 10, fill: "#14b8a6" }, // teal
    { name: "Autres", value: 5, fill: "#818cf8" } // violet clair
];

const renderLegend = (value: string) => <span className="text-slate-500 text-xs">{value}</span>;

export default function PieChart() {
    return (
        <div className="bg-dark-card rounded-xl p-6 border border-blue-950">
            <p className="text-xs text-blue-400/50 uppercase tracking-widest mb-1">Fichiers</p>
            <p className="text-slate-200 font-semibold mb-6">Répartition par type de fichier</p>
            <ResponsiveContainer width="100%" height={260}>
                <RechartsPieChart>
                    <Pie
                        data={mockData}
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
        </div>
    );
}

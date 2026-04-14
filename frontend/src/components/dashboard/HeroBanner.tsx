const user = "John";
const stats = { documents: 24, groups: 6, notifications: 3 };

export default function HeroBanner() {
    return (
        <div className="relative h-64 overflow-hidden bg-hero bg-cover bg-center">
            {/* Overlay sombre pour lisibilité */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Gradient overlay bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-b from-transparent to-gray-950" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-between px-12">
                {/* Left: Welcome */}
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                        Tableau de bord
                    </p>
                    <h1 className="text-4xl font-bold text-white leading-tight">
                        Bonjour, <span className="text-cyan-300">{user}</span>
                    </h1>
                    <p className="text-sm text-gray-400 mt-2">
                        Que souhaitez-vous faire aujourd'hui ?
                    </p>
                </div>

                {/* Right: Stats */}
                <div className="flex gap-10">
                    {[
                        { value: stats.documents, label: "Documents" },
                        { value: stats.groups, label: "Groupes" },
                        { value: stats.notifications, label: "Notifs" }
                    ].map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-4xl font-extrabold text-white leading-none">
                                {s.value}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

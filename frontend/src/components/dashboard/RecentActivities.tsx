// Données mock - à remplacer par un vrai appel API lors du câblage
const mockActivities = [
    {
        id: 1,
        message: "Vous avez rejoint le groupe Projet S6",
        date: "12/02/2026 à 13h53"
    },
    {
        id: 2,
        message: "Vous avez créé le groupe Dev Frontend",
        date: "11/02/2026 à 10h20"
    },
    {
        id: 3,
        message: "Vous avez été expulsé du groupe Design",
        date: "10/02/2026 à 09h05"
    },
    {
        id: 4,
        message: "Vous avez rejoint le groupe Backend",
        date: "09/02/2026 à 14h30"
    },
    {
        id: 5,
        message: "Vous avez créé le groupe Lockr Team",
        date: "08/02/2026 à 08h15"
    }
];

export default function RecentActivities() {
    return (
        <div className="bg-dark-card rounded-xl p-6 border border-blue-950">
            {/* Titre de la section */}
            <p className="text-xs text-blue-400/50 uppercase tracking-widest mb-1">Historique</p>
            <p className="text-slate-200 font-semibold mb-6">Activités récentes</p>

            {/* Liste des activités */}
            <ul className="flex flex-col gap-4">
                {mockActivities.map((activity) => (
                    <li
                        key={activity.id}
                        className="flex items-start gap-4 border-b border-blue-950 pb-4 last:border-none last:pb-0"
                    >
                        {/* Point indicateur */}
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-400 shrink-0" />

                        {/* Contenu */}
                        <div className="flex flex-col">
                            <span className="text-slate-300 text-sm">{activity.message}</span>
                            <span className="text-slate-500 text-xs mt-1">{activity.date}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

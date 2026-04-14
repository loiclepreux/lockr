import NotificationCenter from "../components/notification/NotificationCenter";

export default function NotificationPage() {
    return (
        <main className="min-w-0 bg-[#0b0f14] text-white">
            <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
                <div className="max-w-6xl mx-auto flex flex-col gap-6">
                    <header>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
                            Mes{" "}
                            <span className="text-cyan-400">notifications</span>
                        </h1>
                        <p className="mt-2 text-sm text-gray-400">
                            Consultez toutes les activités et alertes liées à
                            votre espace sécurisé.
                        </p>
                    </header>

                    <section className="rounded-2xl border border-cyan-500/10 bg-[#111318] p-4 sm:p-6 shadow-[0_0_35px_rgba(0,255,255,0.03)]">
                        <NotificationCenter />
                    </section>
                </div>
            </div>
        </main>
    );
}

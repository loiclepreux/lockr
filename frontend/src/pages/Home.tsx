import Footer from "../components/landingpage/Footer";
import HeroBanner from "../components/landingpage/HeroBanner";
import NavBarLanding from "../components/ui/NavBarLanding";

const Home = () => {
    return (
        <div className="bg-[#0b0f14] text-white">
            <NavBarLanding />
            <HeroBanner />

            {/* Section Services */}
            <section className="px-4 py-16 sm:px-6 md:px-10 lg:px-20 xl:px-32">
                <h2 className="text-2xl sm:text-3xl font-bold mb-10">
                    Nos services
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="min-h-[220px] bg-neutral-800 rounded-3xl border border-white/5 p-6 sm:p-8 flex flex-col justify-end hover:bg-neutral-700 transition-colors cursor-pointer">
                        <h3 className="text-xl font-semibold">
                            Stockage Cloud
                        </h3>
                        <p className="text-gray-400 mt-2">
                            Accédez à vos fichiers partout, tout le temps.
                        </p>
                    </div>

                    <div className="min-h-[220px] bg-neutral-800 rounded-3xl border border-white/5 p-6 sm:p-8 flex flex-col justify-end hover:bg-neutral-700 transition-colors cursor-pointer">
                        <h3 className="text-xl font-semibold">
                            Sécurité AES-256
                        </h3>
                        <p className="text-gray-400 mt-2">
                            Le plus haut niveau de chiffrement actuel.
                        </p>
                    </div>

                    <div className="min-h-[220px] bg-neutral-800 rounded-3xl border border-white/5 p-6 sm:p-8 flex flex-col justify-end hover:bg-neutral-700 transition-colors cursor-pointer">
                        <h3 className="text-xl font-semibold">
                            Partage Rapide
                        </h3>
                        <p className="text-gray-400 mt-2">
                            Envoyez vos documents en un clic.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;

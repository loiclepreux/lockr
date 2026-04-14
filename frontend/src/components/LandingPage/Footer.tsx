import logo from "../../assets/images/logo.png";

export default function Footer() {
    return (
        <footer className="bg-[#020617] border-t border-blue-900/40 text-gray-400">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-24">

                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <img src={logo} alt="Lockr logo" className="w-10 h-10" />
                        <span className="text-white font-semibold text-3xl">
                            Lockr
                        </span>
                    </div>

                    <p className="text-sm text-gray-500 leading-relaxed">
                        Lockr est une plateforme sécurisée permettant de
                        stocker, organiser et partager vos fichiers personnels
                        en toute sécurité.
                    </p>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">
                        Navigation
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-blue-400 cursor-pointer">
                            Accueil
                        </li>
                        <li className="hover:text-blue-400 cursor-pointer">
                            Documents
                        </li>
                        <li className="hover:text-blue-400 cursor-pointer">
                            Groupes
                        </li>
                        <li className="hover:text-blue-400 cursor-pointer">
                            Mon compte
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">Sécurité</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-blue-400 cursor-pointer">
                            Confidentialité
                        </li>
                        <li className="hover:text-blue-400 cursor-pointer">
                            Conditions d'utilisation
                        </li>
                        <li className="hover:text-blue-400 cursor-pointer">
                            Support
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-blue-900/40 py-4 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} Lockr — Tous droits réservés
            </div>
        </footer>
    );
}

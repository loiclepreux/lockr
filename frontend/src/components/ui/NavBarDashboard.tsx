import { Bell, FileText, LogOut, UserCircle, Users, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import foto from "../../assets/images/photo.png";

interface NavBarDashboardProps {
    onNavigate?: () => void;
    onOpenNotifications?: () => void;
}

const NavBarDashboard = ({
    onNavigate,
    onOpenNotifications,
}: NavBarDashboardProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onNavigate?.();
        navigate("/");
    };

    const handleNotificationsClick = () => {
        onNavigate?.();

        setTimeout(() => {
            onOpenNotifications?.();
        }, 150);
    };

    return (
        <aside className="h-full w-64 bg-[#0f1115] text-white border-r border-cyan-500/10 shadow-[0_0_30px_rgba(0,255,255,0.04)] flex flex-col">
            <div className="px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="Logo LockR"
                        className="w-10 h-10 object-contain"
                    />

                    <h1 className="text-2xl font-bold tracking-wide text-white">
                        Lock<span className="text-cyan-400">r</span>
                    </h1>
                </div>
            </div>

            <div className="px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400">
                        <img
                            src={foto}
                            alt="Photo profil"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h2 className="text-lg font-semibold">Wesley Doe</h2>
                </div>
            </div>

            <ul className="flex-1 px-4 py-6 space-y-2 text-sm">
                <li>
                    <button
                        type="button"
                        onClick={handleNotificationsClick}
                        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300 cursor-pointer"
                    >
                        <div className="relative">
                            <Bell size={24} />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                3
                            </span>
                        </div>
                        <span>Notifications</span>
                    </button>
                </li>

                <li>
                    <Link
                        to="/documents"
                        onClick={onNavigate}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300 cursor-pointer"
                    >
                        <FileText size={24} />
                        <span>Documents</span>
                    </Link>
                </li>

                <li>
                    <Link
                        to="/groups"
                        onClick={onNavigate}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300 cursor-pointer"
                    >
                        <Users size={24} />
                        <span>Groupes</span>
                    </Link>
                </li>

                <li>
                    <Link
                        to="/myAccount"
                        onClick={onNavigate}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300 cursor-pointer"
                    >
                        <UserCircle size={24} />
                        <span>Mon compte</span>
                    </Link>
                </li>

                <li>
                    <Link
                        to="/dashboard"
                        onClick={onNavigate}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300 cursor-pointer"
                    >
                        <Home size={24} />
                        <span>Accueil</span>
                    </Link>
                </li>
            </ul>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
                >
                    <LogOut size={24} />
                    <span>Se déconnecter</span>
                </button>
            </div>
        </aside>
    );
};

export default NavBarDashboard;

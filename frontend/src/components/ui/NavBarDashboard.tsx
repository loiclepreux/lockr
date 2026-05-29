import { Bell, FileText, Home, LogOut, UserCircle, Users } from "lucide-react";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import logo from "../../assets/images/logo.png";
import foto from "../../assets/images/photo.png";
import NotificationsModal from "../notification/NotificationsModal";
import { useLogout } from "../../hooks/useAuth";
import { NotificationsApi } from "../../api/notifications.api";
import { AuthApi } from "../../api/auth.api";

type NavBarDashboardProps = {
    onOpenNotifications?: () => void;
    onNavigate?: () => void;
};

const NavBarDashboard = ({
    onOpenNotifications,
    onNavigate,
}: NavBarDashboardProps) => {
    const navigate = useNavigate();

    // =========================
    // Déconnexion
    // =========================
    const { mutate: logout, isPending } = useLogout();

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => navigate("/signin"),
        });
    };

    // =========================
    // Notifications non lues
    // =========================
    const { data: unreadCount = 0 } = useQuery({
        queryKey: ["notifications-count"],
        queryFn: NotificationsApi.countUnread,
    });

    // ===================
    // Profil connecté
    // ===================

    const { data: meResponse } = useQuery({
        queryKey: ["me"],
        queryFn: AuthApi.me,
    });

    const profile = meResponse?.data?.profile;

    const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

    const profileImage = profile?.imgUrl
        ? `${API_URL}${profile.imgUrl}?v=${meResponse?.data?.updatedAt ?? ""}`
        : foto;

    const displayName =
        `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() ||
        meResponse?.data?.email ||
        "Utilisateur";

    return (
        <>
            <aside className="h-screen w-full bg-[#0f1115] text-white border-r border-cyan-500/10 shadow-[0_0_30px_rgba(0,255,255,0.04)] flex flex-col">
                {/* ========================= */}
                {/* LOGO */}
                {/* ========================= */}
                <div className="px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="Logo LockR"
                            className="w-10 h-10 object-contain"
                        />

                        <h1 className="text-2xl font-bold tracking-wide text-white">
                            Lock
                            <span className="text-cyan-400">r</span>
                        </h1>
                    </div>
                </div>

                {/* ========================= */}
                {/* PROFIL */}
                {/* ========================= */}
                <div className="px-6 py-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400">
                            <img
                                src={profileImage}
                                alt="Photo profil"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h2 className="text-lg font-semibold">{displayName}</h2>
                    </div>
                </div>

                {/* ========================= */}
                {/* MENU */}
                {/* ========================= */}
                <ul className="flex-1 px-4 py-6 space-y-2 text-sm">
                    {/* Notifications */}
                    <li>
                        <button
                            type="button"
                            onClick={() => {
                                onOpenNotifications?.();
                                onNavigate?.();
                            }}
                            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300"
                        >
                            <div className="relative">
                                <Bell size={24} />

                                {unreadCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>

                            <span>Notifications</span>
                        </button>
                    </li>

                    {/* Documents */}
                    <li>
                        <Link
                            to="/documents"
                            onClick={onNavigate}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300"
                        >
                            <FileText size={24} />
                            <span>Documents</span>
                        </Link>
                    </li>

                    {/* Groupes */}
                    <li>
                        <Link
                            to="/groups"
                            onClick={onNavigate}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300"
                        >
                            <Users size={24} />
                            <span>Groupes</span>
                        </Link>
                    </li>

                    {/* Mon compte */}
                    <li>
                        <Link
                            to="/myAccount"
                            onClick={onNavigate}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300"
                        >
                            <UserCircle size={24} />
                            <span>Mon compte</span>
                        </Link>
                    </li>

                    {/* Dashboard */}
                    <li>
                        <Link
                            to="/dashboard"
                            onClick={onNavigate}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300"
                        >
                            <Home size={24} />
                            <span>Accueil</span>
                        </Link>
                    </li>
                </ul>

                {/* ========================= */}
                {/* DECONNEXION */}
                {/* ========================= */}
                <div className="mt-auto border-t border-white/5 p-4">
                    <button
                        onClick={handleLogout}
                        disabled={isPending}
                        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
                    >
                        <LogOut size={24} />

                        <span>
                            {isPending ? "Déconnexion..." : "Se déconnecter"}
                        </span>
                    </button>
                </div>
            </aside>

            {/* ========================= */}
            {/* MODAL NOTIFICATIONS */}
            {/* ========================= */}
            <NotificationsModal />
        </>
    );
};

export default NavBarDashboard;

import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavBarDashboard from "../ui/NavBarDashboard";
import NotificationsModal from "../notification/NotificationsModal";

const PrivateLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const openNotificationsModal = () => {
        const modal = document.getElementById(
            "notifications_modal",
        ) as HTMLDialogElement | null;

        modal?.showModal();
    };

    return (
        <div className="min-h-screen bg-[#0a0b0e] text-white">
            {/* Header mobile */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#0a0b0e]/95 px-4 py-4 backdrop-blur lg:hidden">
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(true)}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
                    aria-label="Ouvrir le menu"
                >
                    <Menu size={22} />
                </button>

                <h1 className="text-lg font-bold tracking-wide">
                    Lock<span className="text-cyan-400">r</span>
                </h1>

                <div className="w-[40px]" />
            </header>

            <div className="flex min-h-screen">
                {/* Sidebar desktop */}
                <aside className="hidden lg:block lg:w-64 lg:flex-none">
                    <NavBarDashboard
                        onOpenNotifications={openNotificationsModal}
                    />
                </aside>

                {/* Drawer mobile */}
                {isMenuOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden">
                        <div
                            className="absolute inset-0 bg-black/60"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-[#0f1115] shadow-2xl">
                            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                                <h2 className="text-lg font-semibold">Menu</h2>

                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
                                    aria-label="Fermer le menu"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <NavBarDashboard
                                onNavigate={() => setIsMenuOpen(false)}
                                onOpenNotifications={openNotificationsModal}
                            />
                        </div>
                    </div>
                )}

                {/* Contenu */}
                <main className="min-w-0 flex-1">
                    <div className="p-4 sm:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Modal hors du drawer */}
            <NotificationsModal />
        </div>
    );
};

export default PrivateLayout;

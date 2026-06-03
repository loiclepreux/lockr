import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import NavBarLanding from "../ui/NavBarLanding";

const PublicLayout = () => {
    const user = useAuthStore((state) => state.user);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-[#0b0f14] text-white">
            <NavBarLanding />
            <Outlet />
        </div>
    );
};

export default PublicLayout;

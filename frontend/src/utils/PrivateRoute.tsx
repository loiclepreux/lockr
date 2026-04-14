import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { useRefreshToken } from "../hooks/use-auth.service";

export default function PrivateRoute() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const { isLoading, isError } = useRefreshToken();

    if (accessToken) return <Outlet />;

    if (isLoading) return <div>Chargement...</div>;

    if (isError) return <Navigate to="/signin" replace />;

    return <Outlet />;
}

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

const PrivateRoute = () => {
    const accessToken = useAuthStore((state) => state.accessToken);

    if (!accessToken) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;

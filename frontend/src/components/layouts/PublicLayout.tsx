import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

// --------------------------------------------------------------------------
// PublicLayout (LOC-103) — Layout des pages NON connectées
//
// Ce composant enveloppe : Home (landing), Signin, Signup
//
// Il fait deux choses :
//   1. Si l'utilisateur est DÉJÀ connecté → redirige vers /dashboard
//      (pas besoin de revoir la page login quand on est déjà connecté)
//   2. Sinon → affiche la page enfant via <Outlet />
//
// Note : on n'ajoute PAS la NavBarLanding ici car chaque page
// l'importe peut-être déjà de son côté
// On pourra centraliser ça plus tard quand toute l'équipe sera alignée.
// --------------------------------------------------------------------------

const PublicLayout = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Si déjà connecté, pas besoin de voir login/register
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // Outlet = la page enfant (Home, Signin, ou Signup)
    return <Outlet />;
};

export default PublicLayout;

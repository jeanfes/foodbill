import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const isAuth = useAuthStore((state) => state.isAuth);
    const location = useLocation();

    if (isAuth) {
        // Usuario autenticado: dirigir al home real
        return <Navigate to="/home" state={{ from: location.pathname }} replace />;
    } else {
        return children;
    }
};

export default PublicRoute;

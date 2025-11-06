import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const isAuth = useAuthStore((state) => state.isAuth);
    const location = useLocation();

    if (isAuth) {
        return <Navigate to="/inicio" state={{ from: location.pathname }} />;
    } else {
        return children;
    }
};

export default PublicRoute;

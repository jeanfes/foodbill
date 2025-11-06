import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const isAuth = useAuthStore((state) => state.isAuth);
    const location = useLocation();

    if (isAuth) {
        return children;
    } else {
        return <Navigate to="/inicio-sesion" state={{ from: location.pathname }} />;
    }
};

export default PrivateRoute;

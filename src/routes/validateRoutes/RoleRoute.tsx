import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import type { UserRole } from "@/interfaces/role";

interface RoleRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    fallbackPath?: string;
}

const RoleRoute = ({ children, allowedRoles, fallbackPath = "/not-found" }: RoleRouteProps) => {
    const user = useAuthStore((state) => state.user);
    const userRole = user?.profile?.role?.name;

    if (!userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to={fallbackPath} replace />;
    }

    return <>{children}</>;
};

export default RoleRoute;

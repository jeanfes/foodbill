import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

interface RoleRouteProps {
    componentsByRole?: Record<string, React.ReactElement>;
}

const RoleRoute = ({ componentsByRole }: RoleRouteProps) => {
    const [isValid, setIsValid] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const userRole = useMemo(() => user?.profile?.role?.name?.toUpperCase(), [user]);

    useEffect(() => {
        if (!componentsByRole || !userRole || !(userRole in componentsByRole)) {
            navigate("/not-found");
        } else {
            setIsValid(false);
        }
    }, [componentsByRole, userRole, navigate]);

    if (isValid) return null;

    return userRole && componentsByRole?.[userRole] ? componentsByRole[userRole] : null;
};

export default RoleRoute;

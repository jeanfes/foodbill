import { Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import type { Permission } from "@/interfaces/role";

interface PermissionRouteProps {
    children: React.ReactNode;
    requiredPermission?: Permission;
    requiredPermissions?: Permission[];
    requireAll?: boolean;
    fallbackPath?: string;
}

const PermissionRoute = ({
    children,
    requiredPermission,
    requiredPermissions,
    requireAll = false,
    fallbackPath = "/unauthorized",
}: PermissionRouteProps) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

    if (requiredPermission) {
        if (!hasPermission(requiredPermission)) {
            return <Navigate to={fallbackPath} replace />;
        }
        return <>{children}</>;
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
        const hasAccess = requireAll
            ? hasAllPermissions(requiredPermissions)
            : hasAnyPermission(requiredPermissions);

        if (!hasAccess) {
            return <Navigate to={fallbackPath} replace />;
        }
        return <>{children}</>;
    }

    return <Navigate to={fallbackPath} replace />;
};

export default PermissionRoute;

import { usePermissions } from "@/hooks/usePermissions";
import type { Permission } from "@/interfaces/role";
import type { ReactNode } from "react";

interface CanProps {
    permission?: Permission;
    permissions?: Permission[];
    requireAll?: boolean;
    fallback?: ReactNode;
    children: ReactNode;
}

export const Can = ({
    permission,
    permissions,
    requireAll = false,
    fallback = null,
    children,
}: CanProps) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

    let hasAccess = false;

    if (permission) {
        hasAccess = hasPermission(permission);
    } else if (permissions && permissions.length > 0) {
        hasAccess = requireAll
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);
    }

    return hasAccess ? <>{children}</> : <>{fallback}</>;
};

import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/interfaces/role";
import type { ReactNode } from "react";

interface CanAccessRoleProps {
    allowedRoles: UserRole[];
    fallback?: ReactNode;
    children: ReactNode;
}

export const CanAccessRole = ({
    allowedRoles,
    fallback = null,
    children,
}: CanAccessRoleProps) => {
    const user = useAuthStore((state) => state.user);
    const userRole = user?.profile?.role?.name;

    const hasAccess = userRole && allowedRoles.includes(userRole);

    return hasAccess ? <>{children}</> : <>{fallback}</>;
};

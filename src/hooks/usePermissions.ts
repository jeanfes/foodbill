import { useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { Permission, rolePermissionsConfig } from "@/interfaces/role";

export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);

  const userPermissions = useMemo(() => {
    if (!user?.profile?.role?.name) return [];

    const roleConfig = rolePermissionsConfig.find(
      (config) => config.role === user.profile.role.name
    );

    return roleConfig?.permissions || [];
  }, [user]);

  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => userPermissions.includes(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => userPermissions.includes(permission));
  };

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};

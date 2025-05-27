
import { useMemo } from 'react';

export const useUserStatusLogic = () => {
  // ID do grupo "Geral" (temporário) baseado nos logs
  const GERAL_GROUP_ID = "564c55dc-0ab8-481e-a0bc-97ea7e484b88";

  const isActive = (status: string) => {
    const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : '';
    return normalizedStatus === "ativo" || normalizedStatus === "active";
  };

  const isTemporaryGroup = (permissionGroupId?: string | null, role?: string) => {
    return permissionGroupId === GERAL_GROUP_ID && role !== "Admin";
  };

  const isAdminUser = (role?: string) => {
    return role === "Admin";
  };

  const getUserRowClass = (role?: string, isTemporary?: boolean) => {
    if (isAdminUser(role)) {
      return "bg-blue-50/30 border-l-4 border-l-blue-300";
    }
    if (isTemporary) {
      return "bg-orange-50/30 border-l-4 border-l-orange-300";
    }
    return "";
  };

  return {
    isActive,
    isTemporaryGroup,
    isAdminUser,
    getUserRowClass,
    GERAL_GROUP_ID
  };
};

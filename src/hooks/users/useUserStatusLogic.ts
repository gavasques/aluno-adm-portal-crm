
import { UserStatus, PermissionGroup } from '@/types/user.enums';

export const useUserStatusLogic = () => {
  const isActive = (status: string): boolean => {
    const normalizedStatus = status?.toLowerCase() || '';
    return normalizedStatus === 'ativo' || normalizedStatus === 'active';
  };

  const isTemporaryGroup = (permissionGroupId: string | null, role: string): boolean => {
    return permissionGroupId === PermissionGroup.GERAL && role !== 'Admin';
  };

  const isAdminUser = (role: string): boolean => {
    return role === 'Admin';
  };

  const getStatusVariant = (status: string, isTemporary: boolean) => {
    if (isTemporary) return 'warning';
    return isActive(status) ? 'success' : 'destructive';
  };

  const getStatusText = (status: string, isTemporary: boolean) => {
    if (isTemporary) return 'Pendente';
    return isActive(status) ? 'Ativo' : 'Inativo';
  };

  const getUserRowClass = (role: string, isTemporary: boolean) => {
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
    getStatusVariant,
    getStatusText,
    getUserRowClass
  };
};

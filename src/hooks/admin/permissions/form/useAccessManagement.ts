
interface UseAccessManagementProps {
  isAdmin: boolean;
  allowAdminAccess: boolean;
  setAllowAdminAccess: (value: boolean) => void;
}

export const useAccessManagement = ({
  isAdmin,
  allowAdminAccess,
  setAllowAdminAccess,
}: UseAccessManagementProps) => {
  const handleAllowAdminAccessChange = (value: boolean) => {
    if (isAdmin) {
      // Se é admin total, não pode ter acesso limitado
      setAllowAdminAccess(false);
    } else {
      setAllowAdminAccess(value);
    }
  };

  return { handleAllowAdminAccessChange };
};

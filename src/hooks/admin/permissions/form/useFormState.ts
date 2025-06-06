
import { useState, useEffect } from "react";

interface UseFormStateProps {
  isEdit: boolean;
  permissionGroup?: any;
}

export const useFormState = ({ isEdit, permissionGroup }: UseFormStateProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [allowAdminAccess, setAllowAdminAccess] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingGroupData, setLoadingGroupData] = useState(false);

  useEffect(() => {
    if (isEdit && permissionGroup) {
      setName(permissionGroup.name || "");
      setDescription(permissionGroup.description || "");
      setIsAdmin(permissionGroup.is_admin || false);
      setAllowAdminAccess(permissionGroup.allow_admin_access || false);
      
      // Resetar menus selecionados - serão carregados pelo useMenuManagement
      setSelectedMenus([]);
    } else {
      // Reset para novo grupo
      setName("");
      setDescription("");
      setIsAdmin(false);
      setAllowAdminAccess(false);
      setSelectedMenus([]);
    }
  }, [isEdit, permissionGroup]);

  return {
    name,
    setName,
    description,
    setDescription,
    isAdmin,
    setIsAdmin,
    allowAdminAccess,
    setAllowAdminAccess,
    selectedMenus,
    setSelectedMenus,
    isSubmitting,
    setIsSubmitting,
    loadingGroupData,
    setLoadingGroupData,
  };
};

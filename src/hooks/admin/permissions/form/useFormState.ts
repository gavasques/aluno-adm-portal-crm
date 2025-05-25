
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
  const [loadingGroupData, setLoadingGroupData] = useState(isEdit);

  // Initialize form data for edit mode
  useEffect(() => {
    if (isEdit && permissionGroup) {
      console.log("=== INITIALIZING FORM FOR EDIT ===");
      console.log("permissionGroup:", permissionGroup);
      
      setName(permissionGroup.name || "");
      setDescription(permissionGroup.description || "");
      setIsAdmin(permissionGroup.is_admin || false);
      setAllowAdminAccess(permissionGroup.allow_admin_access || false);
    } else {
      // Reset for new group creation
      console.log("=== RESET FOR NEW GROUP ===");
      setName("");
      setDescription("");
      setIsAdmin(false);
      setAllowAdminAccess(false);
      setSelectedMenus([]);
      setLoadingGroupData(false);
    }
  }, [isEdit, permissionGroup?.id]);

  return {
    // Form fields
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
    // Loading states
    isSubmitting,
    setIsSubmitting,
    loadingGroupData,
    setLoadingGroupData,
  };
};

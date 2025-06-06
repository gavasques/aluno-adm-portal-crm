
import { usePermissionGroupCrud } from "../usePermissionGroupCrud";
import { toast } from "@/hooks/use-toast";

interface UseFormSubmissionProps {
  isEdit: boolean;
  permissionGroup?: any;
  name: string;
  description: string;
  isAdmin: boolean;
  allowAdminAccess: boolean;
  selectedMenus: string[];
  setIsSubmitting: (value: boolean) => void;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useFormSubmission = ({
  isEdit,
  permissionGroup,
  name,
  description,
  isAdmin,
  allowAdminAccess,
  selectedMenus,
  setIsSubmitting,
  onSuccess,
  onOpenChange,
}: UseFormSubmissionProps) => {
  const { createPermissionGroup, updatePermissionGroup } = usePermissionGroupCrud();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome do grupo é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = {
        name: name.trim(),
        description: description.trim(),
        is_admin: isAdmin,
        allow_admin_access: isAdmin ? true : allowAdminAccess,
        menu_keys: isAdmin ? [] : selectedMenus,
      };

      const result = isEdit
        ? await updatePermissionGroup({ id: permissionGroup.id, ...formData })
        : await createPermissionGroup(formData);

      if (result.success) {
        toast({
          title: "Sucesso",
          description: isEdit
            ? "Grupo de permissão atualizado com sucesso"
            : "Grupo de permissão criado com sucesso",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao salvar grupo de permissão",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro ao salvar grupo:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro inesperado ao salvar grupo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};

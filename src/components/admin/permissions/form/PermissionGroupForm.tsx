
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { usePermissionGroupForm } from "@/hooks/admin/usePermissionGroupForm";
import { BasicFormFields } from "./BasicFormFields";
import { AdminAccessSwitches } from "./AdminAccessSwitches";
import { MenuPermissionsSection } from "./MenuPermissionsSection";
import { FormActions } from "./FormActions";
import { Loader2 } from "lucide-react";

interface PermissionGroupFormProps {
  isEdit: boolean;
  permissionGroup?: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PermissionGroupForm: React.FC<PermissionGroupFormProps> = ({
  isEdit,
  permissionGroup,
  onOpenChange,
  onSuccess,
}) => {
  const {
    name,
    setName,
    description,
    setDescription,
    isAdmin,
    setIsAdmin,
    allowAdminAccess,
    setAllowAdminAccess,
    selectedMenus,
    isSubmitting,
    isLoading,
    systemMenus,
    handleSubmit,
    handleMenuToggle,
  } = usePermissionGroupForm({
    isEdit,
    permissionGroup,
    onOpenChange,
    onSuccess,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Carregando dados do formulário...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Editar' : 'Novo'} Grupo de Permissão</DialogTitle>
        <DialogDescription>
          {isEdit
            ? 'Edite as informações do grupo de permissão.'
            : 'Crie um novo grupo de permissões para os usuários.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="grid gap-4">
          <BasicFormFields
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
          />

          <AdminAccessSwitches
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            allowAdminAccess={allowAdminAccess}
            setAllowAdminAccess={setAllowAdminAccess}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
          />

          <Separator className="my-2" />

          <MenuPermissionsSection
            isAdmin={isAdmin}
            allowAdminAccess={allowAdminAccess}
            selectedMenus={selectedMenus}
            systemMenus={systemMenus}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            onMenuToggle={handleMenuToggle}
          />
        </div>

        <FormActions
          isEdit={isEdit}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </form>
    </>
  );
};

export default PermissionGroupForm;

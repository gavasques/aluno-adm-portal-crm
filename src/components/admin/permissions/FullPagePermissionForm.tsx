
import React, { memo, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { usePermissionGroupForm } from "@/hooks/admin/usePermissionGroupForm";
import { BasicFormFields } from "./form/BasicFormFields";
import { AdminAccessSwitches } from "./form/AdminAccessSwitches";
import { MenuPermissionsSection } from "./form/MenuPermissionsSection";
import { FormActions } from "./form/FormActions";

interface FullPagePermissionFormProps {
  isEdit: boolean;
  permissionGroup?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const FullPagePermissionForm = memo<FullPagePermissionFormProps>(({
  isEdit,
  permissionGroup,
  onCancel,
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
    onOpenChange: onCancel,
    onSuccess,
  });

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  }, [handleSubmit]);

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
    <form onSubmit={handleFormSubmit} className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Informações Básicas */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
            <BasicFormFields
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Níveis de Acesso</h3>
            <AdminAccessSwitches
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              allowAdminAccess={allowAdminAccess}
              setAllowAdminAccess={setAllowAdminAccess}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        {/* Permissões de Menu */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissões de Menu</h3>
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
        </div>
      </div>

      <Separator />

      <FormActions
        isEdit={isEdit}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
});

FullPagePermissionForm.displayName = 'FullPagePermissionForm';

export default FullPagePermissionForm;

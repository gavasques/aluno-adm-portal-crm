
import React, { memo, useCallback } from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { usePermissionGroupForm } from "@/hooks/admin/usePermissionGroupForm";
import { BasicFormFields } from "./form/BasicFormFields";
import { AdminAccessSwitches } from "./form/AdminAccessSwitches";
import { MenuPermissionsSection } from "./form/MenuPermissionsSection";
import { FormActions } from "./form/FormActions";

interface OptimizedPermissionFormProps {
  isEdit: boolean;
  permissionGroup?: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const LoadingSkeleton = memo(() => (
  <div className="space-y-4 py-4">
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-20 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const OptimizedPermissionForm = memo<OptimizedPermissionFormProps>(({
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

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  }, [handleSubmit]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

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

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <BasicFormFields
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              isLoading={false}
              isSubmitting={isSubmitting}
            />

            <AdminAccessSwitches
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              allowAdminAccess={allowAdminAccess}
              setAllowAdminAccess={setAllowAdminAccess}
              isLoading={false}
              isSubmitting={isSubmitting}
            />

            <Separator className="my-2" />

            <MenuPermissionsSection
              isAdmin={isAdmin}
              allowAdminAccess={allowAdminAccess}
              selectedMenus={selectedMenus}
              systemMenus={systemMenus}
              isLoading={false}
              isSubmitting={isSubmitting}
              onMenuToggle={handleMenuToggle}
            />
          </div>

          <FormActions
            isEdit={isEdit}
            isLoading={false}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />
        </form>
      )}
    </>
  );
});

OptimizedPermissionForm.displayName = 'OptimizedPermissionForm';

export default OptimizedPermissionForm;

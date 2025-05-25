
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface AdminAccessSwitchesProps {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  allowAdminAccess: boolean;
  setAllowAdminAccess: (value: boolean) => void;
  isLoading: boolean;
  isSubmitting: boolean;
}

export const AdminAccessSwitches: React.FC<AdminAccessSwitchesProps> = ({
  isAdmin,
  setIsAdmin,
  allowAdminAccess,
  setAllowAdminAccess,
  isLoading,
  isSubmitting,
}) => {
  return (
    <>
      <div className="flex items-center space-x-2 py-2">
        <Switch
          id="is-admin"
          checked={isAdmin}
          onCheckedChange={setIsAdmin}
          disabled={isLoading || isSubmitting}
        />
        <Label htmlFor="is-admin">Este é um grupo de administrador (acesso total)</Label>
      </div>

      <div className="flex items-center space-x-2 py-2">
        <Switch
          id="allow-admin-access"
          checked={allowAdminAccess}
          onCheckedChange={setAllowAdminAccess}
          disabled={isLoading || isSubmitting || isAdmin}
        />
        <Label htmlFor="allow-admin-access">Permitir acesso à área administrativa</Label>
      </div>

      {isAdmin && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Grupos de administrador têm acesso a todas as funcionalidades do sistema e automaticamente podem acessar a área administrativa.
          </AlertDescription>
        </Alert>
      )}

      {allowAdminAccess && !isAdmin && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Este grupo poderá acessar a área administrativa com base nas permissões específicas configuradas abaixo. 
            Os menus selecionados serão preservados mesmo com acesso administrativo habilitado.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

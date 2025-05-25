
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, Shield, Lock } from "lucide-react";

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
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-red-500" />
          <Label htmlFor="is-admin">Este é um grupo de administrador (acesso total)</Label>
        </div>
      </div>

      <div className="flex items-center space-x-2 py-2">
        <Switch
          id="allow-admin-access"
          checked={allowAdminAccess}
          onCheckedChange={setAllowAdminAccess}
          disabled={isLoading || isSubmitting || isAdmin}
        />
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-orange-500" />
          <Label htmlFor="allow-admin-access">Permitir acesso à área administrativa</Label>
        </div>
      </div>

      {isAdmin && (
        <Alert className="border-red-200 bg-red-50">
          <Shield className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong>Acesso Total:</strong> Grupos de administrador têm acesso a todas as funcionalidades do sistema. 
            Os menus específicos são automaticamente limpos pois este grupo tem permissões completas.
          </AlertDescription>
        </Alert>
      )}

      {allowAdminAccess && !isAdmin && (
        <Alert className="border-green-200 bg-green-50">
          <Lock className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong>✅ Acesso Administrativo Limitado:</strong> Este grupo poderá acessar a área administrativa 
            apenas para os menus selecionados abaixo. <strong>Os menus selecionados serão preservados.</strong>
          </AlertDescription>
        </Alert>
      )}

      {!allowAdminAccess && !isAdmin && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <strong>Acesso Apenas à Área do Aluno:</strong> Este grupo terá acesso limitado aos menus 
            selecionados, mas apenas na área do aluno.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

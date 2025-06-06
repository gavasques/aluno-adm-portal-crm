
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Shield, Users, Settings } from "lucide-react";
import { usePermissionGroupForm } from "@/hooks/admin/usePermissionGroupForm";
import { PermissionFormProps } from "@/types/permissions";

const UnifiedPermissionForm: React.FC<PermissionFormProps> = ({
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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Carregando formulário...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {isEdit ? "Editar Grupo de Permissão" : "Novo Grupo de Permissão"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Básicas</CardTitle>
            <CardDescription>
              Defina as informações fundamentais do grupo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Grupo *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Administradores, Editores, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva as responsabilidades e escopo deste grupo..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Acesso */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações de Acesso
            </CardTitle>
            <CardDescription>
              Determine o nível de acesso administrativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Admin Total */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  <Label htmlFor="isAdmin" className="font-medium">
                    Administrador Total
                  </Label>
                  {isAdmin && <Badge variant="destructive" className="text-xs">Acesso Completo</Badge>}
                </div>
                <p className="text-sm text-gray-600">
                  Acesso irrestrito a todas as funcionalidades do sistema
                </p>
              </div>
              <Switch
                id="isAdmin"
                checked={isAdmin}
                onCheckedChange={setIsAdmin}
              />
            </div>

            {/* Admin Limitado */}
            {!isAdmin && (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    <Label htmlFor="allowAdminAccess" className="font-medium">
                      Acesso Administrativo Limitado
                    </Label>
                    {allowAdminAccess && <Badge variant="secondary" className="text-xs">Admin Limitado</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">
                    Permite acesso ao painel administrativo com menus específicos
                  </p>
                </div>
                <Switch
                  id="allowAdminAccess"
                  checked={allowAdminAccess}
                  onCheckedChange={setAllowAdminAccess}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Seleção de Menus */}
        {!isAdmin && allowAdminAccess && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Menus Permitidos</CardTitle>
              <CardDescription>
                Selecione quais menus este grupo pode acessar no painel administrativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {systemMenus.map((menu) => (
                  <div
                    key={menu.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      id={menu.menu_key}
                      checked={selectedMenus.includes(menu.menu_key)}
                      onCheckedChange={() => handleMenuToggle(menu.menu_key)}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={menu.menu_key}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {menu.display_name}
                      </Label>
                      {menu.description && (
                        <p className="text-xs text-gray-500">
                          {menu.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedMenus.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2">
                    Menus selecionados ({selectedMenus.length}):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedMenus.map((menuKey) => {
                      const menu = systemMenus.find(m => m.menu_key === menuKey);
                      return (
                        <Badge key={menuKey} variant="secondary" className="text-xs">
                          {menu?.display_name || menuKey}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Ações */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEdit ? "Salvando..." : "Criando..."}
              </>
            ) : (
              <>{isEdit ? "Salvar Alterações" : "Criar Grupo"}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UnifiedPermissionForm;

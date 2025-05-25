
import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox-group";
import { Separator } from "@/components/ui/separator";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { useSystemMenus } from "@/hooks/admin/useSystemMenus";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

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
  const { createPermissionGroup, updatePermissionGroup, getPermissionGroupMenus } = usePermissionGroups();
  const { systemMenus, isLoading: loadingMenus } = useSystemMenus();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [allowAdminAccess, setAllowAdminAccess] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingGroupData, setLoadingGroupData] = useState(isEdit);

  // Carregar dados do grupo para edição
  useEffect(() => {
    const loadGroupData = async () => {
      if (isEdit && permissionGroup) {
        setName(permissionGroup.name || "");
        setDescription(permissionGroup.description || "");
        setIsAdmin(permissionGroup.is_admin || false);
        setAllowAdminAccess(permissionGroup.allow_admin_access || false);
        
        try {
          // Buscar menus associados a este grupo
          const menuData = await getPermissionGroupMenus(permissionGroup.id);
          const menuKeys = menuData.map((item: any) => item.menu_key);
          setSelectedMenus(menuKeys);
        } catch (error) {
          console.error("Erro ao carregar menus do grupo:", error);
        } finally {
          setLoadingGroupData(false);
        }
      } else {
        setLoadingGroupData(false);
      }
    };
    
    loadGroupData();
  }, [isEdit, permissionGroup, getPermissionGroupMenus]);

  // Automaticamente habilitar acesso admin se for grupo admin
  useEffect(() => {
    if (isAdmin) {
      setAllowAdminAccess(true);
    }
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) return;
    
    try {
      setIsSubmitting(true);
      
      // CORREÇÃO PRINCIPAL: Distinguir entre admin completo e admin limitado
      let menusToSend: string[];
      
      if (isAdmin) {
        // Admin completo - não precisa de menus específicos
        menusToSend = [];
      } else {
        // Admin limitado ou usuário normal - preservar menus selecionados
        menusToSend = selectedMenus;
      }
      
      console.log("=== SUBMIT DEBUG ===");
      console.log("isAdmin:", isAdmin);
      console.log("allowAdminAccess:", allowAdminAccess);
      console.log("selectedMenus:", selectedMenus);
      console.log("menusToSend:", menusToSend);
      console.log("===================");
      
      if (isEdit && permissionGroup) {
        await updatePermissionGroup({
          id: permissionGroup.id,
          name,
          description,
          is_admin: isAdmin,
          allow_admin_access: allowAdminAccess,
          menu_keys: menusToSend
        });
      } else {
        await createPermissionGroup({
          name,
          description,
          is_admin: isAdmin,
          allow_admin_access: allowAdminAccess,
          menu_keys: menusToSend
        });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar grupo de permissão:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMenuToggle = (menuKey: string) => {
    setSelectedMenus((prev) => {
      if (prev.includes(menuKey)) {
        return prev.filter(key => key !== menuKey);
      } else {
        return [...prev, menuKey];
      }
    });
  };

  const isLoading = loadingMenus || loadingGroupData;

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
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Grupo</Label>
            <Input
              id="name"
              placeholder="Ex: Gerentes de Marketing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading || isSubmitting}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição das permissões deste grupo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading || isSubmitting}
            />
          </div>

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

          <Separator className="my-2" />

          <div className="space-y-2">
            <Label>Permissões do Grupo</Label>
            
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <p>Carregando opções...</p>
              </div>
            )}

            {!isLoading && (
              <>
                {isAdmin ? (
                  <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Info className="h-4 w-4" />
                      <span className="text-sm font-medium">Acesso Total</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Este grupo tem acesso completo a todas as funcionalidades do sistema.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <CheckboxGroup className="space-y-2">
                      {systemMenus.map((menu: any) => (
                        <CheckboxItem
                          key={menu.menu_key}
                          id={`menu-${menu.menu_key}`}
                          label={menu.display_name}
                          description={menu.description || ''}
                          checked={selectedMenus.includes(menu.menu_key)}
                          onCheckedChange={() => handleMenuToggle(menu.menu_key)}
                          disabled={isSubmitting}
                        />
                      ))}
                    </CheckboxGroup>
                  </div>
                )}

                {!isAdmin && systemMenus.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum menu disponível. Contate o administrador do sistema.
                  </p>
                )}

                {!isAdmin && allowAdminAccess && selectedMenus.length > 0 && (
                  <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <Info className="h-4 w-4" />
                      <span className="text-sm font-medium">Acesso Administrativo Limitado</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Este grupo terá acesso à área administrativa apenas para os {selectedMenus.length} menus selecionados.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Salvar Alterações' : 'Criar Grupo'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default PermissionGroupForm;

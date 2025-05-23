
import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Shield, CheckSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { useSystemModules } from "@/hooks/admin/useSystemModules";
import { useModularPermissions, ModulePermissionData } from "@/hooks/admin/useModularPermissions";
import { supabase } from "@/integrations/supabase/client";

interface ModularPermissionFormProps {
  isEdit: boolean;
  permissionGroup?: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ModularPermissionForm: React.FC<ModularPermissionFormProps> = ({
  isEdit,
  permissionGroup,
  onOpenChange,
  onSuccess,
}) => {
  const { createPermissionGroup, updatePermissionGroup } = usePermissionGroups();
  const { modules, isLoading: loadingModules, getModulesByCategory } = useSystemModules();
  const { getGroupModulePermissions, saveGroupModulePermissions, isSubmitting } = useModularPermissions();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [modulePermissions, setModulePermissions] = useState<ModulePermissionData[]>([]);
  const [loadingGroupData, setLoadingGroupData] = useState(isEdit);

  // Carregar dados do grupo para edição
  useEffect(() => {
    const loadGroupData = async () => {
      if (isEdit && permissionGroup && modules.length > 0) {
        setName(permissionGroup.name || "");
        setDescription(permissionGroup.description || "");
        setIsAdmin(permissionGroup.is_admin || false);
        
        try {
          const permissions = await getGroupModulePermissions(permissionGroup.id, modules);
          setModulePermissions(permissions);
        } catch (error) {
          console.error("Erro ao carregar permissões do grupo:", error);
        } finally {
          setLoadingGroupData(false);
        }
      } else if (!isEdit && modules.length > 0) {
        // Para novo grupo, inicializar com todas as permissões desmarcadas
        const emptyPermissions: ModulePermissionData[] = modules.map(module => ({
          module_id: module.id,
          module_key: module.module_key,
          module_name: module.module_name,
          actions: module.actions.map(action => ({
            action_id: action.id,
            action_key: action.action_key,
            action_name: action.action_name,
            granted: false
          }))
        }));
        setModulePermissions(emptyPermissions);
        setLoadingGroupData(false);
      }
    };
    
    loadGroupData();
  }, [isEdit, permissionGroup, modules, getGroupModulePermissions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) return;
    
    try {
      if (isEdit && permissionGroup) {
        // Atualizar grupo existente
        await updatePermissionGroup({
          id: permissionGroup.id,
          name,
          description,
          is_admin: isAdmin,
          menu_keys: [] // Manter compatibilidade
        });
        
        // Salvar permissões modulares se não for admin
        if (!isAdmin) {
          await saveGroupModulePermissions(permissionGroup.id, modulePermissions);
        }
      } else {
        // Criar novo grupo usando o hook
        await createPermissionGroup({
          name,
          description,
          is_admin: isAdmin,
          menu_keys: [] // Manter compatibilidade
        });
        
        // Para novo grupo, se não for admin, buscar o ID do grupo recém-criado
        if (!isAdmin) {
          // Buscar o grupo recém-criado para obter o ID
          const { data: newGroups, error } = await supabase
            .from("permission_groups")
            .select("id")
            .eq("name", name)
            .order("created_at", { ascending: false })
            .limit(1);
            
          if (!error && newGroups && newGroups.length > 0) {
            await saveGroupModulePermissions(newGroups[0].id, modulePermissions);
          }
        }
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar grupo de permissão:", error);
    }
  };

  const handleModuleActionToggle = (moduleId: string, actionId: string) => {
    setModulePermissions(prev => 
      prev.map(module => 
        module.module_id === moduleId
          ? {
              ...module,
              actions: module.actions.map(action =>
                action.action_id === actionId
                  ? { ...action, granted: !action.granted }
                  : action
              )
            }
          : module
      )
    );
  };

  const handleModuleToggleAll = (moduleId: string, granted: boolean) => {
    setModulePermissions(prev => 
      prev.map(module => 
        module.module_id === moduleId
          ? {
              ...module,
              actions: module.actions.map(action => ({ ...action, granted }))
            }
          : module
      )
    );
  };

  const isLoading = loadingModules || loadingGroupData;
  const categorizedModules = getModulesByCategory();

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {isEdit ? 'Editar' : 'Novo'} Grupo de Permissão
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? 'Edite as informações e permissões do grupo.'
            : 'Crie um novo grupo de permissões modular para os usuários.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
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

          {isAdmin && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Grupos de administrador têm acesso a todas as funcionalidades do sistema, independente das permissões selecionadas.
              </AlertDescription>
            </Alert>
          )}

          <Separator className="my-2" />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              <Label className="text-base font-semibold">Permissões Modulares</Label>
            </div>
            
            {!isAdmin && isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <p>Carregando módulos...</p>
              </div>
            )}

            {!isAdmin && !isLoading && (
              <div className="space-y-4">
                {Object.entries(categorizedModules).map(([category, modules]) => (
                  <Card key={category} className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {category === 'core' ? 'Principal' : 
                         category === 'suppliers' ? 'Fornecedores' :
                         category === 'partnerships' ? 'Parcerias' :
                         category === 'tools' ? 'Ferramentas' :
                         category === 'admin' ? 'Administração' : category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {modules.map(module => {
                        const modulePermission = modulePermissions.find(mp => mp.module_id === module.id);
                        const allGranted = modulePermission?.actions.every(a => a.granted) || false;
                        const someGranted = modulePermission?.actions.some(a => a.granted) || false;
                        
                        return (
                          <div key={module.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={allGranted}
                                  onCheckedChange={(checked) => handleModuleToggleAll(module.id, !!checked)}
                                  className="h-5 w-5"
                                />
                                <div>
                                  <h4 className="font-medium">{module.module_name}</h4>
                                  {module.description && (
                                    <p className="text-sm text-muted-foreground">{module.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {module.is_premium && (
                                  <Badge variant="secondary" className="text-xs">Premium</Badge>
                                )}
                                {someGranted && (
                                  <Badge variant={allGranted ? "default" : "outline"} className="text-xs">
                                    {allGranted ? "Completo" : "Parcial"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-8">
                              {modulePermission?.actions.map(action => (
                                <div key={action.action_id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${module.id}-${action.action_id}`}
                                    checked={action.granted}
                                    onCheckedChange={() => handleModuleActionToggle(module.id, action.action_id)}
                                    className="h-4 w-4"
                                  />
                                  <Label 
                                    htmlFor={`${module.id}-${action.action_id}`}
                                    className="text-sm font-normal cursor-pointer"
                                  >
                                    {action.action_name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isAdmin && !isLoading && Object.keys(categorizedModules).length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum módulo disponível. Contate o administrador do sistema.
              </p>
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

export default ModularPermissionForm;

import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Shield, CheckSquare, Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { useSystemMenus } from "@/hooks/admin/useSystemMenus";
import { useSystemModules } from "@/hooks/admin/useSystemModules";
import { useModularPermissions, ModulePermissionData } from "@/hooks/admin/useModularPermissions";
import { MenuPermissionsSection } from "./form/MenuPermissionsSection";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface UnifiedPermissionFormProps {
  isEdit: boolean;
  permissionGroup?: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UnifiedPermissionForm: React.FC<UnifiedPermissionFormProps> = ({
  isEdit,
  permissionGroup,
  onOpenChange,
  onSuccess,
}) => {
  const { createPermissionGroup, updatePermissionGroup, getPermissionGroupMenus } = usePermissionGroups();
  const { systemMenus, isLoading: loadingMenus } = useSystemMenus();
  const { modules, isLoading: loadingModules, getModulesByCategory } = useSystemModules();
  const { getGroupModulePermissions, saveGroupModulePermissions, isSubmitting } = useModularPermissions();
  
  // Estados básicos
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [allowAdminAccess, setAllowAdminAccess] = useState(false);
  
  // Estados para menus
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  
  // Estados para módulos
  const [modulePermissions, setModulePermissions] = useState<ModulePermissionData[]>([]);
  
  const [loadingGroupData, setLoadingGroupData] = useState(isEdit);

  // Carregar dados do grupo para edição
  useEffect(() => {
    const loadGroupData = async () => {
      if (isEdit && permissionGroup) {
        console.log("=== CARREGANDO DADOS DO GRUPO (UNIFICADO) ===");
        console.log("Grupo:", permissionGroup.name);
        
        setName(permissionGroup.name || "");
        setDescription(permissionGroup.description || "");
        setIsAdmin(permissionGroup.is_admin || false);
        setAllowAdminAccess(permissionGroup.allow_admin_access || false);
        
        try {
          // Carregar menus
          if (permissionGroup.id) {
            const menuData = await getPermissionGroupMenus(permissionGroup.id);
            const menuKeys = menuData.map((item: any) => item.menu_key);
            setSelectedMenus(menuKeys);
            console.log("Menus carregados:", menuKeys);
          }
          
          // Carregar módulos (se disponíveis)
          if (modules.length > 0) {
            const permissions = await getGroupModulePermissions(permissionGroup.id, modules);
            setModulePermissions(permissions);
            console.log("Módulos carregados:", permissions.length);
          }
        } catch (error) {
          console.error("Erro ao carregar dados do grupo:", error);
        } finally {
          setLoadingGroupData(false);
        }
      } else if (!isEdit && modules.length > 0) {
        // Para novo grupo, inicializar com permissões vazias
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
  }, [isEdit, permissionGroup, modules, getPermissionGroupMenus, getGroupModulePermissions]);

  // Controle do isAdmin - SIMPLIFICADO para evitar efeitos colaterais
  const handleIsAdminChange = (value: boolean) => {
    console.log("=== MUDANÇA isAdmin (UNIFICADO) ===");
    console.log("Valor anterior:", isAdmin);
    console.log("Novo valor:", value);
    
    setIsAdmin(value);
    
    if (value) {
      // Admin completo: automaticamente habilita acesso admin e limpa menus
      setAllowAdminAccess(true);
      setSelectedMenus([]);
      console.log("✅ Admin completo: acesso habilitado e menus limpos");
    }
    
    console.log("=======================================");
  };

  // Controle do allowAdminAccess - DIRETO sem efeitos colaterais
  const handleAllowAdminAccessChange = (value: boolean) => {
    console.log("=== MUDANÇA allowAdminAccess (UNIFICADO) ===");
    console.log("Valor anterior:", allowAdminAccess);
    console.log("Novo valor:", value);
    console.log("isAdmin atual:", isAdmin);
    console.log("Menus atuais:", selectedMenus.length);
    
    if (!isAdmin) {
      // Para usuários não-admin, permitir alteração sem tocar nos menus
      setAllowAdminAccess(value);
      console.log("✅ Admin limitado: allowAdminAccess alterado, menus PRESERVADOS");
    } else {
      // Admin completo sempre tem allowAdminAccess = true
      setAllowAdminAccess(true);
      console.log("⚠️ Admin completo: mantendo allowAdminAccess = true");
    }
    
    console.log("==========================================");
  };

  // Toggle de menu - SIMPLES e direto
  const handleMenuToggle = (menuKey: string) => {
    if (isAdmin) {
      console.log("🔴 Admin completo - toggle de menu bloqueado");
      return;
    }
    
    setSelectedMenus(prev => {
      const newMenus = prev.includes(menuKey)
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey];
      
      console.log("✅ Menu toggled:", menuKey, "Total menus:", newMenus.length);
      return newMenus;
    });
  };

  // Toggle de módulos
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) return;
    
    try {
      console.log("=== SUBMISSÃO UNIFICADA ===");
      console.log("Nome:", name);
      console.log("isAdmin:", isAdmin);
      console.log("allowAdminAccess:", allowAdminAccess);
      console.log("Menus selecionados:", selectedMenus.length);
      
      if (isEdit && permissionGroup) {
        // Atualizar grupo existente
        await updatePermissionGroup({
          id: permissionGroup.id,
          name,
          description,
          is_admin: isAdmin,
          allow_admin_access: allowAdminAccess,
          menu_keys: selectedMenus // Passar menus diretamente
        });
        
        // Salvar permissões modulares
        await saveGroupModulePermissions(permissionGroup.id, modulePermissions);
      } else {
        // Criar novo grupo
        await createPermissionGroup({
          name,
          description,
          is_admin: isAdmin,
          allow_admin_access: allowAdminAccess,
          menu_keys: selectedMenus // Passar menus diretamente
        });
        
        // Para novo grupo, buscar ID e salvar módulos
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
      
      console.log("✅ Submissão concluída com sucesso");
      console.log("===============================");
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("❌ Erro ao salvar grupo de permissão:", error);
    }
  };

  const isLoading = loadingMenus || loadingModules || loadingGroupData;
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
            ? 'Edite as informações e permissões do grupo em uma interface unificada.'
            : 'Crie um novo grupo de permissões com controle completo de menus e módulos.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
        {/* Informações Básicas */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Grupo</Label>
            <Input
              id="name"
              placeholder="Ex: Mentores, Gerentes, etc."
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

          {/* Controles de Administração */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm">Tipo de Usuário</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is-admin"
                checked={isAdmin}
                onCheckedChange={handleIsAdminChange}
                disabled={isLoading || isSubmitting}
              />
              <Label htmlFor="is-admin">Este é um grupo de administrador completo (acesso total)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="allow-admin-access"
                checked={allowAdminAccess}
                onCheckedChange={handleAllowAdminAccessChange}
                disabled={isLoading || isSubmitting || isAdmin}
              />
              <Label htmlFor="allow-admin-access">Permitir acesso à área administrativa</Label>
            </div>

            {isAdmin && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Administradores completos têm acesso total ao sistema automaticamente.
                </AlertDescription>
              </Alert>
            )}

            {allowAdminAccess && !isAdmin && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Este grupo poderá acessar a área administrativa com base nas permissões específicas configuradas abaixo.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <Separator />

        {/* Permissões - Tabs para Menus e Módulos */}
        <Tabs defaultValue="menus" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="menus" className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Menus do Sistema
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Módulos Avançados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menus" className="space-y-4">
            <MenuPermissionsSection
              isAdmin={isAdmin}
              allowAdminAccess={allowAdminAccess}
              selectedMenus={selectedMenus}
              systemMenus={systemMenus}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              onMenuToggle={handleMenuToggle}
            />
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            {/* Conteúdo dos módulos mantido igual ao ModularPermissionForm */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                <Label className="text-base font-semibold">Permissões Modulares</Label>
              </div>
              
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <p>Carregando módulos...</p>
                </div>
              )}

              {!isLoading && (
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
            </div>
          </TabsContent>
        </Tabs>

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

export default UnifiedPermissionForm;

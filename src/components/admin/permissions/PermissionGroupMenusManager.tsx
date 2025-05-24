import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useSystemMenus } from "@/hooks/admin/useSystemMenus";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckSquare, Square, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

interface PermissionGroupMenusManagerProps {
  groupId: string;
  groupName: string;
  onClose: () => void;
}

const MENU_TEMPLATES = {
  admin: {
    name: "Admin Completo",
    description: "Acesso completo ao sistema",
    menus: ["dashboard", "users", "permissions", "suppliers", "partners", "tools", "students", "crm", "courses", "mentoring", "bonus", "tasks", "settings"]
  },
  student: {
    name: "Estudante Básico", 
    description: "Acesso básico para estudantes",
    menus: ["dashboard", "my-suppliers", "suppliers", "partners", "tools", "settings"]
  },
  limited: {
    name: "Acesso Limitado",
    description: "Apenas visualização",
    menus: ["dashboard", "suppliers", "partners", "tools"]
  }
};

const MENU_CATEGORIES = {
  admin: {
    name: "Administração",
    menus: ["users", "permissions", "students", "crm", "courses", "mentoring", "bonus", "tasks"],
    color: "bg-red-100 text-red-800"
  },
  student: {
    name: "Área do Estudante", 
    menus: ["my-suppliers", "dashboard"],
    color: "bg-blue-100 text-blue-800"
  },
  general: {
    name: "Geral",
    menus: ["suppliers", "partners", "tools", "settings"],
    color: "bg-green-100 text-green-800"
  }
};

const PermissionGroupMenusManager: React.FC<PermissionGroupMenusManagerProps> = ({
  groupId,
  groupName,
  onClose,
}) => {
  const { systemMenus, isLoading: menusLoading } = useSystemMenus();
  const { updatePermissionGroup } = usePermissionGroups();
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Função interna estável para carregar menus do grupo
  const loadGroupMenus = useCallback(async () => {
    if (!groupId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("permission_group_menus")
        .select("menu_key")
        .eq("permission_group_id", groupId);

      if (error) throw error;
      
      setSelectedMenus(data?.map(m => m.menu_key) || []);
    } catch (error) {
      console.error("Erro ao carregar menus do grupo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os menus do grupo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadGroupMenus();
  }, [loadGroupMenus]);

  const handleMenuToggle = useCallback((menuKey: string) => {
    setSelectedMenus(prev => 
      prev.includes(menuKey)
        ? prev.filter(m => m !== menuKey)
        : [...prev, menuKey]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedMenus(systemMenus.map(menu => menu.menu_key));
  }, [systemMenus]);

  const handleClearAll = useCallback(() => {
    setSelectedMenus([]);
  }, []);

  const handleApplyTemplate = useCallback((templateKey: keyof typeof MENU_TEMPLATES) => {
    const template = MENU_TEMPLATES[templateKey];
    const availableMenus = template.menus.filter(menuKey => 
      systemMenus.some(menu => menu.menu_key === menuKey)
    );
    setSelectedMenus(availableMenus);
  }, [systemMenus]);

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      
      await updatePermissionGroup({
        id: groupId,
        name: groupName,
        description: "",
        is_admin: false,
        allow_admin_access: false,
        menu_keys: selectedMenus,
      });

      toast({
        title: "Menus atualizados",
        description: `Menus do grupo "${groupName}" foram atualizados com sucesso`,
      });

      onClose();
    } catch (error) {
      console.error("Erro ao salvar menus:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os menus",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [groupId, groupName, selectedMenus, updatePermissionGroup, onClose]);

  const getMenuCategory = useCallback((menuKey: string) => {
    for (const [categoryKey, category] of Object.entries(MENU_CATEGORIES)) {
      if (category.menus.includes(menuKey)) {
        return { key: categoryKey, ...category };
      }
    }
    return { key: "general", ...MENU_CATEGORIES.general };
  }, []);

  const organizedMenus = useMemo(() => {
    return systemMenus.reduce((acc, menu) => {
      const category = getMenuCategory(menu.menu_key);
      if (!acc[category.key]) {
        acc[category.key] = { category, menus: [] };
      }
      acc[category.key].menus.push(menu);
      return acc;
    }, {} as Record<string, { category: any; menus: any[] }>);
  }, [systemMenus, getMenuCategory]);

  if (isLoading || menusLoading) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Gerenciar Menus - {groupName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Gerenciar Menus - {groupName}
          {selectedMenus.length === 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Sem menus
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecione quais menus este grupo pode acessar
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Templates */}
        <div>
          <h4 className="text-sm font-medium mb-3">Templates Rápidos</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(MENU_TEMPLATES).map(([key, template]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => handleApplyTemplate(key as keyof typeof MENU_TEMPLATES)}
                className="text-xs"
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Ações em massa */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedMenus.length} de {systemMenus.length} menus selecionados
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
              className="text-xs"
            >
              <CheckSquare className="h-3 w-3 mr-1" />
              Selecionar Todos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAll}
              className="text-xs"
            >
              <Square className="h-3 w-3 mr-1" />
              Limpar Seleção
            </Button>
          </div>
        </div>

        {/* Lista de menus organizados por categoria */}
        <div className="space-y-4">
          {Object.entries(organizedMenus).map(([categoryKey, { category, menus }]) => (
            <div key={categoryKey} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={category.color}>
                  {category.name}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {menus.filter(menu => selectedMenus.includes(menu.menu_key)).length} de {menus.length} selecionados
                </span>
              </div>
              <div className="grid gap-2 pl-4">
                {menus.map((menu) => (
                  <div
                    key={menu.id}
                    className="flex items-center space-x-3 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={menu.menu_key}
                      checked={selectedMenus.includes(menu.menu_key)}
                      onCheckedChange={() => handleMenuToggle(menu.menu_key)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={menu.menu_key}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {menu.display_name}
                      </label>
                      {menu.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {menu.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {menu.menu_key}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Preview dos menus selecionados */}
        {selectedMenus.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">Preview dos Menus Selecionados</h4>
              <div className="flex flex-wrap gap-1">
                {selectedMenus.map(menuKey => {
                  const menu = systemMenus.find(m => m.menu_key === menuKey);
                  return (
                    <Badge key={menuKey} variant="secondary" className="text-xs">
                      {menu?.display_name || menuKey}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Validação de grupo vazio */}
        {selectedMenus.length === 0 && (
          <div className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Atenção</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              Este grupo ficará sem acesso a nenhum menu. Usuários deste grupo não conseguirão navegar no sistema.
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionGroupMenusManager;

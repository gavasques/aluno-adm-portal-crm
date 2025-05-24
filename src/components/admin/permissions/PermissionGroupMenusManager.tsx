
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useSystemMenus } from "@/hooks/admin/useSystemMenus";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PermissionGroupMenusManagerProps {
  groupId: string;
  groupName: string;
  onClose: () => void;
}

const PermissionGroupMenusManager: React.FC<PermissionGroupMenusManagerProps> = ({
  groupId,
  groupName,
  onClose,
}) => {
  const { systemMenus, isLoading: menusLoading } = useSystemMenus();
  const { getPermissionGroupMenus } = usePermissionGroups();
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadGroupMenus = async () => {
      try {
        setIsLoading(true);
        const menus = await getPermissionGroupMenus(groupId);
        setSelectedMenus(menus.map(m => m.menu_key));
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
    };

    loadGroupMenus();
  }, [groupId, getPermissionGroupMenus]);

  const handleMenuToggle = (menuKey: string) => {
    setSelectedMenus(prev => 
      prev.includes(menuKey)
        ? prev.filter(m => m !== menuKey)
        : [...prev, menuKey]
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Usar a função updatePermissionGroup já existente
      const { updatePermissionGroup } = usePermissionGroups();
      
      // Buscar dados atuais do grupo
      const currentGroup = await fetch(`/api/permission-groups/${groupId}`);
      const groupData = await currentGroup.json();
      
      await updatePermissionGroup({
        id: groupId,
        name: groupData.name,
        description: groupData.description,
        is_admin: groupData.is_admin,
        allow_admin_access: groupData.allow_admin_access,
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
  };

  if (isLoading || menusLoading) {
    return (
      <Card className="w-full max-w-2xl">
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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Gerenciar Menus - {groupName}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecione quais menus este grupo pode acessar
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
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

        <div className="flex justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedMenus.length} de {systemMenus.length} menus selecionados
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionGroupMenusManager;

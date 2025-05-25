
import React from "react";
import { Label } from "@/components/ui/label";
import { Loader2, Info } from "lucide-react";
import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox-group";

interface MenuPermissionsSectionProps {
  isAdmin: boolean;
  allowAdminAccess: boolean;
  selectedMenus: string[];
  systemMenus: any[];
  isLoading: boolean;
  isSubmitting: boolean;
  onMenuToggle: (menuKey: string) => void;
}

export const MenuPermissionsSection: React.FC<MenuPermissionsSectionProps> = ({
  isAdmin,
  allowAdminAccess,
  selectedMenus,
  systemMenus,
  isLoading,
  isSubmitting,
  onMenuToggle,
}) => {
  return (
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
                    onCheckedChange={() => onMenuToggle(menu.menu_key)}
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
  );
};

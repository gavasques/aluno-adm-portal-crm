
import React from "react";
import { Label } from "@/components/ui/label";
import { Loader2, Info, Shield, Lock, AlertTriangle } from "lucide-react";
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
            <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Acesso Total - Administrador</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Este grupo tem acesso completo a todas as funcionalidades do sistema. 
                Não é necessário selecionar menus específicos.
              </p>
            </div>
          ) : (
            <>
              {/* Indicador visual do tipo de acesso com validação */}
              <div className={`p-3 border rounded-lg ${
                allowAdminAccess 
                  ? selectedMenus.length > 0 
                    ? 'border-orange-200 bg-orange-50' 
                    : 'border-yellow-200 bg-yellow-50'
                  : 'border-blue-200 bg-blue-50'
              }`}>
                <div className={`flex items-center gap-2 ${
                  allowAdminAccess 
                    ? selectedMenus.length > 0 
                      ? 'text-orange-800' 
                      : 'text-yellow-800'
                    : 'text-blue-800'
                }`}>
                  {allowAdminAccess ? (
                    selectedMenus.length > 0 ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )
                  ) : (
                    <Info className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {allowAdminAccess 
                      ? selectedMenus.length > 0
                        ? `Acesso Administrativo Limitado (${selectedMenus.length} menus)`
                        : `Acesso Administrativo Limitado (NENHUM MENU SELECIONADO)`
                      : `Acesso de Aluno (${selectedMenus.length} menus)`
                    }
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  allowAdminAccess 
                    ? selectedMenus.length > 0 
                      ? 'text-orange-700' 
                      : 'text-yellow-700'
                    : 'text-blue-700'
                }`}>
                  {allowAdminAccess 
                    ? selectedMenus.length > 0
                      ? 'Este grupo terá acesso à área administrativa apenas para os menus selecionados abaixo.'
                      : 'ATENÇÃO: Este grupo tem acesso administrativo mas nenhum menu foi selecionado. Selecione pelo menos um menu.'
                    : 'Este grupo terá acesso apenas à área do aluno para os menus selecionados abaixo.'
                  }
                </p>
              </div>

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
                      disabled={isSubmitting || isAdmin}
                    />
                  ))}
                </CheckboxGroup>
              </div>
            </>
          )}

          {!isAdmin && systemMenus.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum menu disponível. Contate o administrador do sistema.
            </p>
          )}
        </>
      )}
    </div>
  );
};

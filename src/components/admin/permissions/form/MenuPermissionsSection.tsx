
import React from "react";
import { Label } from "@/components/ui/label";
import { Loader2, Info, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  // Agrupar menus por categoria para melhor organização
  const organizeMenusByCategory = (menus: any[]) => {
    const categories = {
      admin: {
        name: "Administração",
        menus: [] as any[],
        color: "bg-red-100 text-red-800"
      },
      mentoring: {
        name: "Mentorias",
        menus: [] as any[],
        color: "bg-purple-100 text-purple-800"
      },
      student: {
        name: "Área do Estudante",
        menus: [] as any[],
        color: "bg-blue-100 text-blue-800"
      },
      general: {
        name: "Geral",
        menus: [] as any[],
        color: "bg-green-100 text-green-800"
      }
    };

    menus.forEach(menu => {
      const key = menu.menu_key;
      
      if (['users', 'permissions', 'students', 'crm', 'credits', 'calendly-config', 'audit', 'tasks'].includes(key)) {
        categories.admin.menus.push(menu);
      } else if (key.startsWith('mentoring-') || ['courses', 'bonus'].includes(key)) {
        categories.mentoring.menus.push(menu);
      } else if (['my-suppliers', 'settings'].includes(key)) {
        categories.student.menus.push(menu);
      } else {
        categories.general.menus.push(menu);
      }
    });

    return categories;
  };

  const categorizedMenus = organizeMenusByCategory(systemMenus);

  return (
    <div className="space-y-4">
      <Label>Permissões do Grupo</Label>
      
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <p>Carregando menus...</p>
        </div>
      )}

      {!isLoading && (
        <>
          {isAdmin ? (
            <Alert className="border-red-200 bg-red-50">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium text-red-800">Acesso Total - Administrador</span>
                <p className="text-sm text-red-700 mt-1">
                  Este grupo tem acesso completo a todas as funcionalidades do sistema. 
                  Não é necessário selecionar menus específicos.
                </p>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Indicador visual aprimorado */}
              <Alert className={`border rounded-lg ${
                allowAdminAccess 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-blue-200 bg-blue-50'
              }`}>
                <div className={`flex items-center gap-2 ${
                  allowAdminAccess ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {allowAdminAccess ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Info className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {allowAdminAccess 
                      ? `✅ Acesso Administrativo Limitado (${selectedMenus.length} menus selecionados)`
                      : `Acesso de Aluno (${selectedMenus.length} menus selecionados)`
                    }
                  </span>
                </div>
                <AlertDescription className={`text-sm mt-1 ${
                  allowAdminAccess ? 'text-green-700' : 'text-blue-700'
                }`}>
                  {allowAdminAccess 
                    ? 'Este grupo terá acesso à área administrativa apenas para os menus selecionados abaixo.'
                    : 'Este grupo terá acesso apenas à área do aluno para os menus selecionados abaixo.'
                  }
                </AlertDescription>
              </Alert>

              {/* Menus organizados por categoria */}
              <div className="space-y-4">
                {Object.entries(categorizedMenus).map(([categoryKey, category]) => {
                  if (category.menus.length === 0) return null;
                  
                  return (
                    <div key={categoryKey} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${category.color}`}>
                          {category.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {category.menus.filter(menu => selectedMenus.includes(menu.menu_key)).length} de {category.menus.length} selecionados
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                        <CheckboxGroup className="space-y-2">
                          {category.menus.map((menu: any) => (
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
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!isAdmin && systemMenus.length === 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium text-orange-800">Nenhum menu encontrado</span>
                <p className="text-sm text-orange-700 mt-1">
                  Execute a sincronização de menus para garantir que todos os menus estejam disponíveis.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

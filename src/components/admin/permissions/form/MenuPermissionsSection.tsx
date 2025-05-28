
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
  // Separar menus por área - CORRIGIDO
  const organizeMenusByArea = (menus: any[]) => {
    const areas = {
      admin: {
        name: "Área Administrativa",
        description: "Menus exclusivos para administradores",
        menus: [] as any[],
        color: "bg-red-100 text-red-800 border-red-200"
      },
      student: {
        name: "Área do Aluno", 
        description: "Menus da área do estudante",
        menus: [] as any[],
        color: "bg-blue-100 text-blue-800 border-blue-200"
      }
    };

    menus.forEach(menu => {
      const key = menu.menu_key;
      
      // Menus da área do aluno (incluindo versões student-*)
      if ([
        'my-suppliers', 'settings', 'student-suppliers', 'student-partners', 'student-tools'
      ].includes(key)) {
        areas.student.menus.push(menu);
      } else {
        // Todos os outros menus vão para área administrativa
        areas.admin.menus.push(menu);
      }
    });

    return areas;
  };

  const organizedMenus = organizeMenusByArea(systemMenus);

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

              {/* Menus organizados por área */}
              <div className="space-y-6">
                {Object.entries(organizedMenus).map(([areaKey, area]) => {
                  if (area.menus.length === 0) return null;
                  
                  const selectedInArea = area.menus.filter(menu => selectedMenus.includes(menu.menu_key)).length;
                  
                  return (
                    <div key={areaKey} className={`rounded-lg border p-4 ${area.color.split(' ')[2]}`}>
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`font-semibold text-lg ${area.color.split(' ')[1]}`}>
                              {area.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {area.description}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${area.color}`}>
                            {selectedInArea} de {area.menus.length} selecionados
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <CheckboxGroup className="contents">
                          {area.menus.map((menu: any) => (
                            <div key={menu.menu_key} className="bg-white rounded border p-3">
                              <CheckboxItem
                                id={`menu-${menu.menu_key}`}
                                label={menu.display_name}
                                description={menu.description || ''}
                                checked={selectedMenus.includes(menu.menu_key)}
                                onCheckedChange={() => onMenuToggle(menu.menu_key)}
                                disabled={isSubmitting || isAdmin}
                              />
                            </div>
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


import React, { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users, CreditCard, BookOpen, FileText, BarChart3, Shield } from "lucide-react";

interface ImprovedMenuPermissionsSectionProps {
  isAdmin: boolean;
  allowAdminAccess: boolean;
  selectedMenus: string[];
  systemMenus: any[];
  isLoading: boolean;
  isSubmitting: boolean;
  onMenuToggle: (menuKey: string) => void;
}

interface MenuCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  keys: string[];
}

interface CategorizedMenuSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  menus: any[];
  selectedCount: number;
}

const menuCategories: Record<string, MenuCategory> = {
  dashboard: {
    title: "Dashboard",
    icon: BarChart3,
    color: "bg-blue-100 text-blue-800",
    keys: ["dashboard"]
  },
  users: {
    title: "Gestão de Usuários",
    icon: Users,
    color: "bg-green-100 text-green-800",
    keys: ["usuarios", "alunos", "permissoes"]
  },
  crm: {
    title: "CRM & Vendas",
    icon: CreditCard,
    color: "bg-purple-100 text-purple-800",
    keys: ["crm", "crm-webhook-logs"]
  },
  content: {
    title: "Conteúdo",
    icon: BookOpen,
    color: "bg-orange-100 text-orange-800",
    keys: ["cursos", "noticias", "bonus"]
  },
  mentoring: {
    title: "Mentorias",
    icon: FileText,
    color: "bg-indigo-100 text-indigo-800",
    keys: ["mentorias", "catalogo", "materiais", "inscricoes-individuais", "inscricoes-grupo", "sessoes-individuais", "sessoes-grupo"]
  },
  management: {
    title: "Gestão",
    icon: Settings,
    color: "bg-gray-100 text-gray-800",
    keys: ["fornecedores", "parceiros", "ferramentas", "categorias", "tipos-parceiros", "tipos-softwares", "creditos", "tarefas"]
  },
  audit: {
    title: "Auditoria & Segurança",
    icon: Shield,
    color: "bg-red-100 text-red-800",
    keys: ["auditoria", "audit-analytics", "audit-reports", "audit-behavior"]
  },
  settings: {
    title: "Configurações",
    icon: Settings,
    color: "bg-yellow-100 text-yellow-800",
    keys: ["configuracoes", "calendly-config"]
  }
};

export const ImprovedMenuPermissionsSection: React.FC<ImprovedMenuPermissionsSectionProps> = ({
  isAdmin,
  allowAdminAccess,
  selectedMenus,
  systemMenus,
  isLoading,
  isSubmitting,
  onMenuToggle,
}) => {
  const categorizedMenus = useMemo(() => {
    const result: Record<string, CategorizedMenuSection> = {};
    
    Object.entries(menuCategories).forEach(([categoryKey, category]) => {
      const categoryMenus = systemMenus.filter(menu => 
        category.keys.some(key => menu.menu_key.includes(key))
      );
      
      if (categoryMenus.length > 0) {
        result[categoryKey] = {
          title: category.title,
          icon: category.icon,
          color: category.color,
          menus: categoryMenus,
          selectedCount: categoryMenus.filter(menu => selectedMenus.includes(menu.menu_key)).length
        };
      }
    });

    // Menus não categorizados
    const uncategorizedMenus = systemMenus.filter(menu => 
      !Object.values(menuCategories).some(category => 
        category.keys.some(key => menu.menu_key.includes(key))
      )
    );

    if (uncategorizedMenus.length > 0) {
      result.others = {
        title: "Outros",
        icon: Settings,
        color: "bg-gray-100 text-gray-800",
        menus: uncategorizedMenus,
        selectedCount: uncategorizedMenus.filter(menu => selectedMenus.includes(menu.menu_key)).length
      };
    }

    return result;
  }, [systemMenus, selectedMenus]);

  if (isAdmin) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-green-800 mb-2">Acesso Total de Administrador</h4>
          <p className="text-green-700">
            Este grupo possui acesso completo a todos os recursos do sistema.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (allowAdminAccess) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6 text-center">
          <Settings className="h-12 w-12 text-orange-600 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-orange-800 mb-2">Acesso Administrativo Limitado</h4>
          <p className="text-orange-700">
            Este grupo possui acesso administrativo com permissões específicas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Selecione os menus que este grupo pode acessar
        </p>
        <Badge variant="secondary">
          {selectedMenus.length} de {systemMenus.length} selecionados
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.entries(categorizedMenus).map(([categoryKey, category]) => {
          const IconComponent = category.icon;
          
          return (
            <Card key={categoryKey} className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <span>{category.title}</span>
                  </div>
                  <Badge variant="outline" className={category.color}>
                    {category.selectedCount}/{category.menus.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.menus.map((menu) => (
                  <div key={menu.menu_key} className="flex items-center space-x-2">
                    <Checkbox
                      id={menu.menu_key}
                      checked={selectedMenus.includes(menu.menu_key)}
                      onCheckedChange={() => onMenuToggle(menu.menu_key)}
                      disabled={isLoading || isSubmitting}
                    />
                    <label
                      htmlFor={menu.menu_key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {menu.menu_name}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

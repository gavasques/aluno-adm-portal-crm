import React, { useState, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Briefcase, 
  ClipboardCheck, 
  ListTodo, 
  BarChart3, 
  Settings,
  Truck,
  Handshake,
  Wrench,
  GraduationCap,
  Calendar,
  FolderOpen,
  UserCheck,
  Users as UsersIcon,
  BookOpenCheck,
  Bell,
  User,
  LogOut,
  ExternalLink,
  ChevronDown,
  CreditCard
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const sidebarItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    group: "Geral"
  },
  {
    title: "Créditos",
    url: "/admin/creditos",
    icon: CreditCard,
    group: "Geral"
  },
  {
    title: "Tarefas",
    url: "/admin/tarefas",
    icon: ListTodo,
    group: "Operacional"
  },
  {
    title: "CRM",
    url: "/admin/crm",
    icon: BarChart3,
    group: "Operacional"
  },
  {
    title: "Fornecedores",
    url: "/admin/fornecedores",
    icon: Truck,
    group: "Geral ADM"
  },
  {
    title: "Parceiros",
    url: "/admin/parceiros",
    icon: Handshake,
    group: "Geral ADM"
  },
  {
    title: "Ferramentas",
    url: "/admin/ferramentas",
    icon: Wrench,
    group: "Geral ADM"
  },
  {
    title: "Dashboard Mentorias",
    url: "/admin/mentorias",
    icon: GraduationCap,
    group: "Mentorias"
  },
  {
    title: "Catálogo",
    url: "/admin/mentorias/catalogo",
    icon: BookOpenCheck,
    group: "Mentorias"
  },
  {
    title: "Inscrições Individuais",
    url: "/admin/inscricoes-individuais",
    icon: UserCheck,
    group: "Mentorias"
  },
  {
    title: "Inscrições em Grupo",
    url: "/admin/inscricoes-grupo",
    icon: UsersIcon,
    group: "Mentorias"
  },
  {
    title: "Sessões Individuais",
    url: "/admin/mentorias/sessoes-individuais",
    icon: Calendar,
    group: "Mentorias"
  },
  {
    title: "Sessões em Grupo",
    url: "/admin/mentorias/sessoes-grupo",
    icon: UsersIcon,
    group: "Mentorias"
  },
  {
    title: "Materiais",
    url: "/admin/mentorias/materiais",
    icon: FolderOpen,
    group: "Mentorias"
  },
  {
    title: "Usuários",
    url: "/admin/usuarios",
    icon: Users,
    group: "Gestão"
  },
  {
    title: "Permissões",
    url: "/admin/permissoes",
    icon: Shield,
    group: "Gestão"
  },
  {
    title: "Cadastros",
    url: "/admin/cadastros",
    icon: Briefcase,
    group: "Gestão"
  },
  {
    title: "Auditoria",
    url: "/admin/auditoria",
    icon: ClipboardCheck,
    group: "Gestão"
  },
  {
    title: "Config. Calendly",
    url: "/admin/calendly-config",
    icon: Calendar,
    group: "Gestão"
  },
  {
    title: "Configurações",
    url: "/admin/configuracoes",
    icon: Settings,
    group: "Sistema"
  }
];

// Ordem dos grupos
const groupOrder = ["Geral", "Operacional", "Geral ADM", "Mentorias", "Gestão", "Sistema"];

const groupedItems = sidebarItems.reduce((groups, item) => {
  const group = item.group;
  if (!groups[group]) {
    groups[group] = [];
  }
  groups[group].push(item);
  return groups;
}, {} as Record<string, typeof sidebarItems>);

export default function AdminSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Determinar qual grupo contém a rota ativa
  const getActiveGroup = () => {
    for (const item of sidebarItems) {
      if (location.pathname === item.url) {
        return item.group;
      }
    }
    return "";
  };

  const activeGroup = getActiveGroup();
  const [openGroups, setOpenGroups] = useState<string[]>([activeGroup]);

  const getUserName = () => {
    return user?.user_metadata?.name || user?.email || "Administrador";
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    if (newWidth >= 200 && newWidth <= 400) {
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Garantir que o grupo ativo esteja sempre aberto
  React.useEffect(() => {
    if (activeGroup && !openGroups.includes(activeGroup)) {
      setOpenGroups(prev => [...prev, activeGroup]);
    }
  }, [activeGroup, openGroups]);

  return (
    <div className="relative">
      <div 
        ref={sidebarRef}
        className="fixed left-0 top-0 h-screen bg-gray-900 text-white overflow-y-auto flex flex-col"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Header da sidebar com logo */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Link to="/admin/dashboard" className="flex items-center">
              <img 
                src="/lovable-uploads/fa166a7e-b1af-4959-a15a-12517ab1ed07.png"
                alt="Logo" 
                className="h-8"
              />
            </Link>
            
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-gray-700">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </div>
        </div>

        {/* Menu de navegação com Accordion */}
        <div className="flex-1 p-3">
          <Accordion 
            type="multiple" 
            value={openGroups} 
            onValueChange={setOpenGroups}
            className="space-y-2"
          >
            {groupOrder.map((groupName) => {
              const items = groupedItems[groupName];
              if (!items) return null;

              return (
                <AccordionItem 
                  key={groupName} 
                  value={groupName}
                  className="border-none"
                >
                  <AccordionTrigger className="text-xs font-semibold text-gray-400 uppercase tracking-wider hover:no-underline hover:text-gray-300 py-2 px-2">
                    {groupName}
                  </AccordionTrigger>
                  <AccordionContent className="pb-2">
                    <nav className="space-y-1 pl-2">
                      {items.map((item) => (
                        <Link
                          key={item.title}
                          to={item.url}
                          className={cn(
                            "flex items-center px-3 py-2 text-xs font-medium rounded-md transition-colors",
                            location.pathname === item.url
                              ? "bg-gray-800 text-white border-l-2 border-blue-500"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                          )}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </Link>
                      ))}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Menu do usuário na parte inferior */}
        <div className="p-3 border-t border-gray-700 mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start h-auto p-2 text-white hover:bg-gray-700">
                <div className="flex flex-col items-start text-left w-full">
                  <span className="font-medium text-xs">{getUserName()}</span>
                  <span className="text-gray-300 text-xs truncate w-full">{user?.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="bg-blue-600 text-white p-3 -mt-1 -mx-1 rounded-t-md">
                <div className="font-medium text-sm">Minha Conta</div>
                <div className="text-xs text-blue-100">
                  {user?.email || "admin@portaledu.com"}
                </div>
              </div>
              
              <DropdownMenuItem asChild>
                <Link to="/admin/dashboard" className="flex cursor-pointer items-center gap-2">
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/admin/configuracoes" className="flex cursor-pointer items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/aluno" className="flex cursor-pointer items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Ir para Área do Aluno
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600 cursor-pointer">
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sair
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Handle de redimensionamento */}
      <div
        className="fixed top-0 h-screen w-1 bg-gray-600 hover:bg-gray-500 cursor-col-resize z-50 transition-colors"
        style={{ left: `${sidebarWidth}px` }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

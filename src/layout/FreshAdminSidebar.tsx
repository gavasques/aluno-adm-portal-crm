
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
  CreditCard,
  Database,
  Cog
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
import { useNotifications } from "@/hooks/useNotifications";

// FRESH COMPONENT - Cache Breaker v3.0.0
const FRESH_SIDEBAR_VERSION = `fresh-admin-sidebar-${Date.now()}`;
console.log(`🔥 FreshAdminSidebar loaded - CACHE BROKEN - ${FRESH_SIDEBAR_VERSION}`);

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
    title: "Categorias",
    url: "/admin/categorias",
    icon: Database,
    group: "Cadastros"
  },
  {
    title: "Tipos de Softwares",
    url: "/admin/tipos-softwares",
    icon: Cog,
    group: "Cadastros"
  },
  {
    title: "Tipos de Parceiros",
    url: "/admin/tipos-parceiros",
    icon: Users,
    group: "Cadastros"
  },
  {
    title: "Configurações",
    url: "/admin/configuracoes",
    icon: Settings,
    group: "Sistema"
  }
];

const groupOrder = ["Geral", "Operacional", "Geral ADM", "Mentorias", "Gestão", "Cadastros", "Sistema"];

const groupedItems = sidebarItems.reduce((groups, item) => {
  const group = item.group;
  if (!groups[group]) {
    groups[group] = [];
  }
  groups[group].push(item);
  return groups;
}, {} as Record<string, typeof sidebarItems>);

export default function FreshAdminSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Force recognition with timestamp
  console.log(`🆕 FRESH SIDEBAR RENDERING - ${new Date().toISOString()}`);

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
    if (newWidth >= 180 && newWidth <= 320) {
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

  React.useEffect(() => {
    if (activeGroup && !openGroups.includes(activeGroup)) {
      setOpenGroups(prev => [...prev, activeGroup]);
    }
  }, [activeGroup, openGroups]);

  return (
    <div className="relative" data-fresh-sidebar={FRESH_SIDEBAR_VERSION}>
      <div 
        ref={sidebarRef}
        className="fixed left-0 top-0 h-screen bg-slate-900 text-white overflow-y-auto flex flex-col border-r border-slate-700 shadow-2xl"
        style={{ width: `${sidebarWidth}px` }}
        data-testid="fresh-admin-sidebar"
        data-cache-breaker={Date.now()}
      >
        {/* Header compacto */}
        <div className="p-3 border-b border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <Link to="/admin/dashboard" className="flex items-center">
              <img 
                src="/lovable-uploads/fa166a7e-b1af-4959-a15a-12517ab1ed07.png"
                alt="Logo" 
                className="h-6"
              />
            </Link>
            
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-slate-700 h-7 w-7">
              <Bell className="h-3 w-3" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </Button>
          </div>
        </div>

        {/* Menu navegação */}
        <div className="flex-1 p-2">
          <Accordion 
            type="multiple" 
            value={openGroups} 
            onValueChange={setOpenGroups}
            className="space-y-1"
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
                  <AccordionTrigger className="text-xs font-semibold text-slate-400 uppercase tracking-wider hover:no-underline hover:text-slate-300 py-2 px-2">
                    {groupName}
                  </AccordionTrigger>
                  <AccordionContent className="pb-1">
                    <nav className="space-y-1 pl-1">
                      {items.map((item) => (
                        <Link
                          key={item.title}
                          to={item.url}
                          className={cn(
                            "flex items-center px-2 py-2 text-xs font-medium rounded-lg transition-all duration-200",
                            location.pathname === item.url
                              ? "bg-blue-600 text-white shadow-lg border-l-4 border-blue-400"
                              : "text-slate-300 hover:bg-slate-700 hover:text-white"
                          )}
                        >
                          <item.icon className="mr-2 h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      ))}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Menu usuário */}
        <div className="p-2 border-t border-slate-700 mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start h-auto p-2 text-white hover:bg-slate-700">
                <div className="flex flex-col items-start text-left w-full">
                  <span className="font-medium text-xs">{getUserName()}</span>
                  <span className="text-slate-300 text-xs truncate w-full">{user?.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="bg-blue-600 text-white p-2 -mt-1 -mx-1 rounded-t-md">
                <div className="font-medium text-xs">Minha Conta</div>
                <div className="text-xs text-blue-100">
                  {user?.email || "admin@portaledu.com"}
                </div>
              </div>
              
              <DropdownMenuItem asChild>
                <Link to="/admin/dashboard" className="flex cursor-pointer items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/admin/configuracoes" className="flex cursor-pointer items-center gap-2 text-sm">
                  <Settings className="h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/aluno" className="flex cursor-pointer items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4" />
                  Ir para Área do Aluno
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600 cursor-pointer text-sm">
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sair
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Handle redimensionamento */}
      <div
        className="fixed top-0 h-screen w-1 bg-slate-600 hover:bg-slate-500 cursor-col-resize z-50 transition-colors"
        style={{ left: `${sidebarWidth}px` }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

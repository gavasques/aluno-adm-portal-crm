
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
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
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

const sidebarItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    group: "Geral"
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
    title: "Config. Calendly",
    url: "/admin/calendly-config",
    icon: Calendar,
    group: "Mentorias"
  },
  {
    title: "Configurações",
    url: "/admin/configuracoes",
    icon: Settings,
    group: "Sistema"
  }
];

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

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white overflow-y-auto">
      {/* Header da sidebar com logo e menu do usuário */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/a9512e96-66c6-47b8-a7c6-5f1820a6c1a3.png"
              alt="Guilherme Vasques Logo" 
              className="h-8"
            />
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-gray-700">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 text-white hover:bg-gray-700">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user?.email ? user.email.charAt(0).toUpperCase() : "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="bg-blue-600 text-white p-4 -mt-1 -mx-1 rounded-t-md">
                  <div className="font-medium">Minha Conta</div>
                  <div className="text-sm text-blue-100">
                    {user?.email || "admin@portaledu.com"}
                  </div>
                </div>
                
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex cursor-pointer items-center gap-2">
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
      </div>

      {/* Menu de navegação */}
      <div className="p-4">
        {Object.entries(groupedItems).map(([groupName, items]) => (
          <div key={groupName} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {groupName}
            </h3>
            <nav className="space-y-1">
              {items.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    location.pathname === item.url
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
}

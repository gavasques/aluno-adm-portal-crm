
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Book, Calendar, Home, List, Settings, Users, User, BookOpen, Database, FileText, BarChart, Wrench, Lock, GraduationCap, Building, CheckCircle, Shield, Activity, Bell, LogOut, ChevronDown, UserCheck, Users2, Clock, CalendarDays } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/usePermissions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/auth";
import { useSignInOut } from "@/hooks/auth/useBasicAuth/useSignInOut";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  menuKey?: string;
  showAlways?: boolean;
}

const NavItem = ({
  href,
  icon: Icon,
  children,
  menuKey,
  showAlways = false
}: NavItemProps) => {
  const { pathname } = useLocation();
  const { permissions } = usePermissions();
  const isActive = pathname === href;
  
  if (!showAlways && menuKey && !permissions.allowedMenus.includes(menuKey)) {
    return null;
  }
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={href} className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200", isActive ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-700 hover:text-white")}>
          <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-400")} />
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const sidebarAnimation = {
  hidden: {
    opacity: 0,
    x: -20
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemAnimation = {
  hidden: {
    opacity: 0,
    x: -20
  },
  show: {
    opacity: 1,
    x: 0
  }
};

const AdminSidebar = () => {
  const { permissions, loading } = usePermissions();
  const { user } = useAuth();
  const { signOut } = useSignInOut();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigateToStudent = () => {
    navigate("/aluno");
  };

  const handleSettings = () => {
    navigate("/admin/configuracoes");
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "A";
  };

  const getUserName = () => {
    return user?.user_metadata?.name || user?.email || "Administrador";
  };
  
  if (loading) {
    return (
      <div className="w-52 h-screen bg-gray-900 border-r border-gray-700 shadow-2xl relative">
        <div className="pt-4 pb-4">
          <div className="flex items-center justify-center h-20">
            <LoadingSpinner size="sm" text="" />
          </div>
        </div>
      </div>
    );
  }

  if (!permissions.hasAdminAccess) {
    return null;
  }

  return (
    <Sidebar className="border-r border-gray-700 w-52 hidden md:block flex-shrink-0 bg-gray-900 shadow-2xl z-30 pr-0">
      <SidebarHeader className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <img 
            src="/lovable-uploads/046b45b2-fcbe-4a91-a015-859f40a6ed5d.png"
            alt="Logo" 
            className="h-8"
          />
          
          <Button variant="ghost" size="sm" className="relative hover:bg-gray-700 px-2">
            <Bell className="h-4 w-4 text-gray-400" />
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">2</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4 bg-gray-900">
        <motion.div variants={sidebarAnimation} initial="hidden" animate="show">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Principal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin" icon={Home} showAlways={true}>Dashboard</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/configuracoes" icon={Settings} menuKey="settings">Configurações</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Gestão
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/usuarios" icon={Users} menuKey="users">Usuários</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/permissoes" icon={Lock} menuKey="permissions">Permissões</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/alunos" icon={User} menuKey="students">Alunos</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/cadastros" icon={Database} menuKey="registers">Cadastros</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/auditoria" icon={Shield} menuKey="audit">Auditoria</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Mentorias & Inscrições
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/mentorias" icon={GraduationCap} showAlways={true}>Dashboard de Mentorias</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/mentorias/catalogo" icon={BookOpen} showAlways={true}>Catálogo</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/inscricoes-individuais" icon={UserCheck} showAlways={true}>Inscrições Individuais</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/inscricoes-grupo" icon={Users2} showAlways={true}>Inscrições em Grupo</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/calendly-config" icon={CalendarDays} showAlways={true}>Configurações Calendly</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Sessões
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/mentorias/sessoes-individuais" icon={Calendar} showAlways={true}>Sessões Individuais</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/mentorias/sessoes-grupo" icon={Clock} showAlways={true}>Sessões em Grupo</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Organização
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/tarefas" icon={List} menuKey="tasks">Lista de Tarefas</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/crm" icon={BookOpen} menuKey="crm">CRM / Gestão de Leads</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Contatos Público
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/fornecedores" icon={Users} menuKey="suppliers">Fornecedores</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/parceiros" icon={BarChart} menuKey="partners">Parceiros</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/ferramentas" icon={Wrench} menuKey="tools">Ferramentas</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-700 bg-gray-900">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-2 rounded-md justify-start h-auto"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-gray-700 text-white text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate text-xs">{getUserName()}</div>
                  <div className="text-[10px] text-gray-500">Administrador</div>
                </div>
                <ChevronDown className="h-3 w-3 text-gray-500 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-800 border border-gray-600 shadow-2xl">
              <DropdownMenuItem onClick={handleNavigateToStudent} className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700">
                <User className="h-4 w-4 mr-2" />
                Ir para Área do Aluno
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleSettings} className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-gray-600" />
              
              <DropdownMenuItem onClick={signOut} className="text-red-400 hover:bg-gray-700 focus:bg-gray-700 hover:text-red-300 focus:text-red-300">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;

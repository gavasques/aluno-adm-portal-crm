
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Book, Calendar, Home, List, Settings, Users, User, BookOpen, Database, FileText, BarChart, Wrench, Lock, GraduationCap, Building, CheckCircle, Shield, Activity, Bell, LogOut, ChevronDown } from "lucide-react";
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
}

const NavItem = ({
  href,
  icon: Icon,
  children,
  menuKey
}: NavItemProps) => {
  const { pathname } = useLocation();
  const { permissions } = usePermissions();
  const isActive = pathname === href;
  
  console.log(`=== NAV ITEM DEBUG: ${children} ===`);
  console.log("Menu key:", menuKey);
  console.log("Allowed menus:", permissions.allowedMenus);
  console.log("Has access:", !menuKey || permissions.allowedMenus.includes(menuKey));
  console.log("================================");
  
  if (menuKey && !permissions.allowedMenus.includes(menuKey)) {
    console.log(`Menu item ${children} hidden - no permission`);
    return null;
  }
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={href} className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200", isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "text-portal-dark hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700")}>
          <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-blue-700 opacity-80")} />
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

  const isAdminArea = location.pathname.startsWith("/admin");
  const isStudentArea = location.pathname.startsWith("/aluno");

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
  
  console.log("=== ADMIN SIDEBAR DEBUG ===");
  console.log("Loading:", loading);
  console.log("Has admin access:", permissions.hasAdminAccess);
  console.log("Allowed menus:", permissions.allowedMenus);
  console.log("===========================");
  
  if (loading) {
    return (
      <div className="w-52 h-screen bg-white border-r border-border shadow-lg relative">
        <div className="pt-4 pb-4">
          <div className="flex items-center justify-center h-20">
            <LoadingSpinner size="sm" text="" />
          </div>
        </div>
      </div>
    );
  }

  if (!permissions.hasAdminAccess) {
    console.log("Admin sidebar hidden - no admin access");
    return null;
  }

  return (
    <Sidebar className="border-r border-border w-52 hidden md:block flex-shrink-0 bg-white shadow-lg z-30 pr-0">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <img 
            src="/lovable-uploads/a9512e96-66c6-47b8-a7c6-5f1820a6c1a3.png"
            alt="Logo" 
            className="h-8"
          />
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 px-2">
            <Bell className="h-4 w-4 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">2</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <motion.div variants={sidebarAnimation} initial="hidden" animate="show">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Principal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin" icon={Home}>Dashboard</NavItem>
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
                  <NavItem href="/admin/usuarios" icon={Users} menuKey="users">Gestão de Usuários</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/permissoes" icon={Lock} menuKey="permissions">Gestão de Permissões</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/alunos" icon={User} menuKey="students">Gestão de Alunos</NavItem>
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
              Organização
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/tarefas" icon={List} menuKey="tasks">Lista de Tarefas</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/leads" icon={BookOpen} menuKey="crm">CRM / Gestão de Leads</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Geral ADM
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

      <SidebarFooter className="p-4 border-t border-gray-200">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md justify-start h-auto"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-gray-600 text-white text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate text-xs">{getUserName()}</div>
                  <div className="text-[10px] text-gray-500">Administrador</div>
                </div>
                <ChevronDown className="h-3 w-3 text-gray-400 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
              {/* Navigation between areas */}
              <DropdownMenuItem onClick={handleNavigateToStudent}>
                <User className="h-4 w-4 mr-2" />
                Ir para Área do Aluno
              </DropdownMenuItem>
              
              {/* Settings */}
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Logout */}
              <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
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

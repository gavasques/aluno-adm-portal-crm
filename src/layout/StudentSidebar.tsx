
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Home, Settings, Users, BarChart, Wrench, Package, Bell, LogOut, User, ChevronDown, GraduationCap } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/auth";
import { useSignInOut } from "@/hooks/auth/useBasicAuth/useSignInOut";
import { useActiveMentoring } from "@/hooks/useActiveMentoring";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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
  customCondition?: boolean;
}

const NavItem = ({
  href,
  icon: Icon,
  children,
  menuKey,
  showAlways = false,
  customCondition
}: NavItemProps) => {
  const { pathname } = useLocation();
  const { permissions } = usePermissions();
  const isActive = pathname === href;
  
  // Check custom condition first, then permissions
  if (customCondition !== undefined && !customCondition) {
    return null;
  }
  
  if (!showAlways && menuKey && !permissions.allowedMenus.includes(menuKey)) {
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
  hidden: { opacity: 0, x: -20 },
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
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

const StudentSidebar = () => {
  const { permissions, loading } = usePermissions();
  const { user } = useAuth();
  const { signOut } = useSignInOut();
  const { hasActiveMentoring, loading: mentoringLoading } = useActiveMentoring();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminArea = location.pathname.startsWith("/admin");
  const isStudentArea = location.pathname.startsWith("/aluno");

  const handleNavigateToAdmin = () => {
    navigate("/admin");
  };

  const handleSettings = () => {
    navigate("/aluno/configuracoes");
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    return user?.user_metadata?.name || user?.email || "Usuário";
  };

  // Verificar se deve mostrar o menu de mentorias
  const shouldShowMentoring = () => {
    // Se tem permissão admin, sempre mostrar
    if (permissions.hasAdminAccess) {
      return true;
    }
    
    // Se tem a permissão específica do menu, mostrar
    if (permissions.allowedMenus.includes('student-mentoring')) {
      return true;
    }
    
    // Para alunos regulares, só mostrar se tem mentoria ativa
    return hasActiveMentoring;
  };
  
  if (loading) {
    return (
      <Sidebar className="border-r border-border w-52 hidden md:block flex-shrink-0 bg-white shadow-lg z-30 pr-0">
        <SidebarContent className="pt-4 pb-4">
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
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
                  <NavItem href="/aluno" icon={Home} showAlways={true}>Dashboard</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/aluno/configuracoes" icon={Settings} menuKey="settings">Configurações</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Minha Área
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/aluno/meus-fornecedores" icon={Package} menuKey="my-suppliers">Meus Fornecedores</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  {mentoringLoading ? (
                    <SidebarMenuItem>
                      <div className="flex items-center gap-2 rounded-md px-3 py-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </SidebarMenuItem>
                  ) : (
                    <NavItem 
                      href="/aluno/mentorias" 
                      icon={GraduationCap} 
                      customCondition={shouldShowMentoring()}
                    >
                      Minhas Mentorias
                    </NavItem>
                  )}
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Geral
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/aluno/fornecedores" icon={Users} menuKey="suppliers">Fornecedores</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/aluno/parceiros" icon={BarChart} menuKey="partners">Parceiros</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/aluno/ferramentas" icon={Wrench} menuKey="tools">Ferramentas</NavItem>
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
                  <div className="text-[10px] text-gray-500">Aluno</div>
                </div>
                <ChevronDown className="h-3 w-3 text-gray-400 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
              {permissions.hasAdminAccess && (
                <DropdownMenuItem onClick={handleNavigateToAdmin}>
                  <Users className="h-4 w-4 mr-2" />
                  Ir para Área Administrativa
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
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

export default StudentSidebar;

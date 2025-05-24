
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Home, Settings, Users, BarChart, Wrench, Package, Bell, LogOut, User, ChevronDown, GraduationCap } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/usePermissions";
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
  
  // Debug logging
  console.log(`=== DEBUG Student NavItem: ${children} ===`);
  console.log(`menuKey: ${menuKey}`);
  console.log(`showAlways: ${showAlways}`);
  console.log(`permissions.allowedMenus:`, permissions.allowedMenus);
  console.log(`should show: ${showAlways || !menuKey || permissions.allowedMenus.includes(menuKey || '')}`);
  console.log(`=== END DEBUG ===`);
  
  // Mostrar sempre durante desenvolvimento ou se showAlways for true
  if (!showAlways && menuKey && !permissions.allowedMenus.includes(menuKey)) {
    console.log(`❌ HIDING Student NavItem: ${children} (menuKey: ${menuKey} not in allowed menus)`);
    return null;
  }
  
  console.log(`✅ SHOWING Student NavItem: ${children}`);
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={href} className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200", isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "text-portal-dark hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700")}>
          <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-blue-700 opacity-80")} />
          <span>{children}</span>
          {/* Debug indicator */}
          {showAlways && <span className="text-xs bg-green-500 text-white px-1 rounded">ALWAYS</span>}
          {menuKey && !showAlways && <span className="text-xs bg-blue-500 text-white px-1 rounded">{menuKey}</span>}
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
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminArea = location.pathname.startsWith("/admin");
  const isStudentArea = location.pathname.startsWith("/aluno");

  // Debug logging for permissions
  console.log(`=== STUDENT SIDEBAR DEBUG ===`);
  console.log(`loading: ${loading}`);
  console.log(`hasAdminAccess: ${permissions.hasAdminAccess}`);
  console.log(`allowedMenus:`, permissions.allowedMenus);
  console.log(`current path: ${location.pathname}`);
  console.log(`=== END STUDENT SIDEBAR DEBUG ===`);

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

  console.log(`✅ Rendering student sidebar`);

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
          {/* Debug info panel */}
          <div className="px-4 py-2 bg-blue-100 text-blue-800 text-xs mb-2">
            <div>DEBUG MODE</div>
            <div>Loading: {loading ? 'Yes' : 'No'}</div>
            <div>Admin: {permissions.hasAdminAccess ? 'Yes' : 'No'}</div>
            <div>Menus: {permissions.allowedMenus.length}</div>
          </div>

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
                  <NavItem href="/aluno/mentorias" icon={GraduationCap} showAlways={true}>Minhas Mentorias</NavItem>
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
              {/* Navigation between areas */}
              {permissions.hasAdminAccess && (
                <DropdownMenuItem onClick={handleNavigateToAdmin}>
                  <Users className="h-4 w-4 mr-2" />
                  Ir para Área Administrativa
                </DropdownMenuItem>
              )}
              
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

export default StudentSidebar;

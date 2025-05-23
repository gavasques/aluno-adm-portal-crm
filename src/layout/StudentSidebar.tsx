
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Book, Home, Settings, Users, BarChart, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/usePermissions";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  menuKey: string;
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

  // Verificar se o usuário tem permissão para acessar este menu
  const hasPermission = permissions.hasAdminAccess || 
    permissions.allowedMenus.length === 0 || 
    permissions.allowedMenus.includes(menuKey);

  // Se não tem permissão, não renderizar o item
  if (!hasPermission) {
    return null;
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={href} className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
          isActive 
            ? "bg-gradient-to-r from-portal-primary to-portal-secondary text-white shadow-md" 
            : "text-portal-dark hover:bg-gradient-to-r hover:from-portal-light hover:to-blue-50 hover:text-portal-primary"
        )}>
          <Icon className={cn(
            "h-4 w-4",
            isActive ? "text-white" : "text-portal-primary opacity-80"
          )} />
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

  // Mostrar loading enquanto carrega as permissões
  if (loading) {
    return (
      <Sidebar className="border-r border-border w-52 hidden md:block flex-shrink-0 bg-white shadow-lg z-30">
        <SidebarTrigger className="fixed top-3 left-4 md:hidden z-50" />
        <SidebarContent className="pt-16 pb-4">
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-r border-border w-52 hidden md:block flex-shrink-0 bg-white shadow-lg z-30">
      <SidebarTrigger className="fixed top-3 left-4 md:hidden z-50" />
      <SidebarContent className="pt-16 pb-4">
        <motion.div variants={sidebarAnimation} initial="hidden" animate="show" className="mt-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-gray-500 px-[15px] py-0">
              Principal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/student" icon={Home} menuKey="dashboard">Dashboard</NavItem>
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
                  <NavItem href="/student/suppliers" icon={Users} menuKey="suppliers">Fornecedores</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/student/partners" icon={BarChart} menuKey="partners">Parceiros</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/student/tools" icon={Book} menuKey="tools">Ferramentas</NavItem>
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
                  <NavItem href="/student/my-suppliers" icon={FileText} menuKey="my-suppliers">Meus Fornecedores</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/student/settings" icon={Settings} menuKey="settings">Configurações</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>
      </SidebarContent>
    </Sidebar>
  );
};

export default StudentSidebar;

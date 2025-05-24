
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Home, Settings, Users, BarChart, Wrench, Package } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/usePermissions";

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
  
  if (menuKey && !permissions.allowedMenus.includes(menuKey)) {
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
  
  if (loading) {
    return (
      <Sidebar className="border-r border-border w-52 hidden md:block flex-shrink-0 bg-white shadow-lg z-30 pr-0">
        <SidebarContent className="pt-16 pb-4">
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-r border-border w-52 hidden md:block flex-shrink-0 bg-white shadow-lg z-30 pr-0">
      <SidebarContent className="pt-16 pb-4">
        <motion.div variants={sidebarAnimation} initial="hidden" animate="show" className="mt-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-1.5 text-xs font-medium text-gray-500">
              Principal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/aluno" icon={Home}>Dashboard</NavItem>
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
    </Sidebar>
  );
};

export default StudentSidebar;

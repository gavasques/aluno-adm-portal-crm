
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Book, Calendar, Home, List, Settings, Users, User, BookOpen, Database, FileText, BarChart, Wrench, Lock, GraduationCap, Building, CheckCircle, Shield, Activity } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/usePermissions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
    <div className="w-52 h-screen bg-white border-r border-border shadow-lg relative overflow-y-auto">
      <div className="pt-4 pb-4">
        <motion.div variants={sidebarAnimation} initial="hidden" animate="show" className="mt-4">
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
      </div>
    </div>
  );
};

export default AdminSidebar;

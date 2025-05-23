
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Book, Calendar, Home, List, Settings, Users, User, BookOpen, Database, FileText, BarChart, Wrench, Lock } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const NavItem = ({
  href,
  icon: Icon,
  children
}: NavItemProps) => {
  const {
    pathname
  } = useLocation();
  const isActive = pathname === href;
  
  return <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={href} className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200", isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "text-portal-dark hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700")}>
          <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-blue-700 opacity-80")} />
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>;
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
  return <Sidebar className="border-r border-border w-52 hidden md:block flex-shrink-0 bg-white shadow-lg z-30 pr-0">
      <SidebarContent className="pt-16 pb-4">
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
                  <NavItem href="/admin/settings" icon={Settings}>Configurações</NavItem>
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
                  <NavItem href="/admin/users" icon={Users}>Gestão de Usuários</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/permissions" icon={Lock}>Gestão de Permissões</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/gestao-alunos" icon={User}>Gestão de Alunos</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/registers" icon={Database}>Cadastros</NavItem>
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
                  <NavItem href="/admin/tasks" icon={List}>Lista de Tarefas</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/crm" icon={BookOpen}>CRM / Gestão de Leads</NavItem>
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
                  <NavItem href="/admin/suppliers" icon={Users}>Fornecedores</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/partners" icon={BarChart}>Parceiros</NavItem>
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <NavItem href="/admin/tools" icon={Wrench}>Ferramentas</NavItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>
      </SidebarContent>
    </Sidebar>;
};

export default AdminSidebar;

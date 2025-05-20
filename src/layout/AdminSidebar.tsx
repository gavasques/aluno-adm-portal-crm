
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Book, 
  Calendar, 
  Home, 
  List, 
  Settings, 
  Users,
  User, 
  BookOpen,
  FolderPlus
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const NavItem = ({ href, icon: Icon, children }: NavItemProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === href;
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link 
          to={href}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
            isActive 
              ? "bg-portal-primary text-white" 
              : "text-portal-dark hover:bg-portal-light hover:text-portal-primary"
          )}
        >
          <Icon className="h-4 w-4" />
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const AdminSidebar = () => {
  return (
    <Sidebar className="border-r border-border w-52 hidden md:block flex-shrink-0 bg-white shadow-sm z-30">
      <SidebarTrigger className="fixed top-3 left-4 md:hidden z-50" />
      <SidebarContent className="pt-16 pb-4">
        <div className="px-3 py-2">
          <h2 className="text-base font-semibold text-portal-primary mb-1">Área do Administrador</h2>
          <p className="text-xs text-gray-500">Painel de controle</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-1.5 text-xs font-medium text-gray-500">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem href="/admin" icon={Home}>Dashboard</NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-1.5 text-xs font-medium text-gray-500">
            Gestão
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem href="/admin/users" icon={Users}>Gestão de Usuários</NavItem>
              <NavItem href="/admin/gestao-alunos" icon={User}>Gestão de Alunos</NavItem>
              <NavItem href="/admin/courses" icon={Book}>Cadastro de Cursos</NavItem>
              <NavItem href="/admin/mentoring" icon={Users}>Cadastro de Mentorias</NavItem>
              <NavItem href="/admin/bonus" icon={FolderPlus}>Cadastro de Bônus</NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-1.5 text-xs font-medium text-gray-500">
            Organização
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem href="/admin/tasks" icon={List}>Lista de Tarefas</NavItem>
              <NavItem href="/admin/crm" icon={BookOpen}>CRM / Gestão de Leads</NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-1.5 text-xs font-medium text-gray-500">
            Geral ADM
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem href="/admin/suppliers" icon={Users}>Fornecedores</NavItem>
              <NavItem href="/admin/partners" icon={Users}>Parceiros</NavItem>
              <NavItem href="/admin/tools" icon={Settings}>Ferramentas</NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;

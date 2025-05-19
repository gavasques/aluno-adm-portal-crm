
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Book, Home, Settings, Users } from "lucide-react";
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
            "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
            isActive 
              ? "bg-portal-primary text-white" 
              : "text-portal-dark hover:bg-portal-light hover:text-portal-primary"
          )}
        >
          <Icon className="h-5 w-5" />
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const StudentSidebar = () => {
  return (
    <Sidebar className="border-r border-border w-64 hidden md:block">
      <SidebarTrigger className="fixed top-3 left-4 md:hidden z-50" />
      <SidebarContent className="pt-16 pb-4">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold text-portal-primary mb-1">Área do Aluno</h2>
          <p className="text-sm text-gray-500">Bem-vindo ao portal</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-sm font-medium text-gray-500">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem href="/student" icon={Home}>Dashboard</NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-sm font-medium text-gray-500">
            Geral
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem href="/student/suppliers" icon={Users}>Fornecedores</NavItem>
              <NavItem href="/student/partners" icon={Users}>Parceiros</NavItem>
              <NavItem href="/student/tools" icon={Book}>Ferramentas</NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-sm font-medium text-gray-500">
            Minha Área
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem href="/student/my-suppliers" icon={Users}>Meus Fornecedores</NavItem>
              <NavItem href="/student/settings" icon={Settings}>Configurações</NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
      </SidebarContent>
    </Sidebar>
  );
};

export default StudentSidebar;

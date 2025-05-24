
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import {
  Home,
  Users,
  GraduationCap,
  Building2,
  Handshake,
  Wrench,
  CheckSquare,
  BarChart3,
  Database,
  Settings,
  Shield,
  Gift,
  BookOpen,
  FileText,
  ClipboardList,
  Calendar,
  User,
  FolderOpen
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
    },
    {
      title: "Usuários",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Alunos",
      url: "/admin/students",
      icon: GraduationCap,
    },
    {
      title: "Fornecedores",
      url: "/admin/suppliers",
      icon: Building2,
    },
    {
      title: "Parceiros",
      url: "/admin/partners",
      icon: Handshake,
    },
    {
      title: "Ferramentas",
      url: "/admin/tools",
      icon: Wrench,
    },
    {
      title: "Lista de Tarefas",
      url: "/admin/tasks",
      icon: CheckSquare,
    },
    {
      title: "CRM",
      url: "/admin/crm",
      icon: BarChart3,
    },
    {
      title: "Auditoria",
      url: "/admin/audit",
      icon: Database,
    },
    {
      title: "Permissões",
      url: "/admin/permissions",
      icon: Shield,
    },
    {
      title: "Bônus",
      url: "/admin/bonus",
      icon: Gift,
    },
    {
      title: "Cursos",
      url: "/admin/courses",
      icon: BookOpen,
    },
    {
      title: "Cadastros",
      url: "/admin/cadastros",
      icon: ClipboardList,
    },
    {
      title: "Configurações",
      url: "/admin/settings",
      icon: Settings,
    },
  ];

  const mentoringItems = [
    {
      title: "Catálogo de Mentorias",
      url: "/admin/mentoring-catalog",
      icon: BookOpen,
    },
    {
      title: "Mentorias Individuais",
      url: "/admin/individual-mentoring",
      icon: User,
    },
    {
      title: "Repositório de Materiais",
      url: "/admin/mentoring-materials",
      icon: FolderOpen,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-200">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="w-8 h-8 bg-portal-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-portal-dark">Admin Portal</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestão de Mentorias</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mentoringItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;

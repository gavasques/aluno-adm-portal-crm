
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
  Building2,
  Truck,
  Handshake,
  Wrench,
  Settings,
  GraduationCap
} from "lucide-react";

const StudentSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      url: "/student",
      icon: Home,
    },
    {
      title: "Fornecedores",
      url: "/student/suppliers",
      icon: Building2,
    },
    {
      title: "Meus Fornecedores",
      url: "/student/my-suppliers",
      icon: Truck,
    },
    {
      title: "Parceiros",
      url: "/student/partners",
      icon: Handshake,
    },
    {
      title: "Ferramentas",
      url: "/student/tools",
      icon: Wrench,
    },
    {
      title: "Minhas Mentorias",
      url: "/student/my-mentoring",
      icon: GraduationCap,
    },
    {
      title: "Configurações",
      url: "/student/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-200">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="w-8 h-8 bg-portal-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-portal-dark">Student Portal</span>
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
      </SidebarContent>
    </Sidebar>
  );
};

export default StudentSidebar;


import React, { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Heart,
  Handshake,
  Wrench,
  GraduationCap,
  Settings,
  CreditCard,
  ChevronDown,
  Shield,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StudentSidebar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const generalMenuItems = [
    {
      title: "Dashboard",
      href: "/aluno/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Meus Créditos",
      href: "/aluno/creditos",
      icon: CreditCard,
    },
  ];

  const resourcesMenuItems = [
    {
      title: "Fornecedores",
      href: "/aluno/fornecedores",
      icon: Building2,
    },
    {
      title: "Parceiros",
      href: "/aluno/parceiros",
      icon: Handshake,
    },
    {
      title: "Ferramentas",
      href: "/aluno/ferramentas",
      icon: Wrench,
    },
  ];

  const myAreaMenuItems = [
    {
      title: "Meus Fornecedores",
      href: "/aluno/meus-fornecedores",
      icon: Heart,
    },
    {
      title: "Mentoria",
      href: "/aluno/mentoria",
      icon: GraduationCap,
    },
  ];

  const settingsMenuItems = [
    {
      title: "Configurações",
      href: "/aluno/configuracoes",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleGoToAdmin = () => {
    navigate("/admin/dashboard");
  };

  const renderMenuGroup = (title: string, items: any[]) => (
    <div className="mb-4">
      <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3 py-2 mx-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg flex flex-col z-50">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-center">
        <img 
          src="/lovable-uploads/6b3114e7-0682-4946-bc7b-d7700403a1e8.png" 
          alt="Portal do Aluno" 
          className="h-8 w-auto"
        />
      </div>

      {/* Menu de navegação */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {renderMenuGroup("Geral", generalMenuItems)}
        {renderMenuGroup("Recursos", resourcesMenuItems)}
        {renderMenuGroup("Minha Área", myAreaMenuItems)}
        {renderMenuGroup("Sistema", settingsMenuItems)}
      </nav>

      {/* Menu do usuário */}
      <div className="p-3 border-t border-gray-100">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="" alt={user?.email || "Aluno"} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                  {user?.email?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {user?.email || "Aluno"}
                </p>
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleGoToAdmin} className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Área Administrativa</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair do Sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default StudentSidebar;

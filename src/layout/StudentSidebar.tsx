
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
  
  const menuItems = [
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
    {
      title: "Fornecedores",
      href: "/aluno/fornecedores",
      icon: Building2,
    },
    {
      title: "Meus Fornecedores",
      href: "/aluno/meus-fornecedores",
      icon: Heart,
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
    {
      title: "Mentoria",
      href: "/aluno/mentoria",
      icon: GraduationCap,
    },
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

  return (
    <div className="h-screen w-64 bg-white shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-center">
        <img 
          src="/lovable-uploads/fa454cc1-cd9c-4fb3-a498-b5575d14146d.png" 
          alt="Portal do Aluno" 
          className="h-12 w-auto"
        />
      </div>

      {/* Informações do usuário */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={user?.email || "Aluno"} />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              {user?.email?.charAt(0)?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email || "Aluno"}
            </p>
            <p className="text-xs text-gray-500 truncate">Estudante</p>
          </div>
        </div>
      </div>

      {/* Menu de navegação */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Menu do usuário */}
      <div className="p-4 border-t border-gray-100">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.email || "Aluno"} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                  {user?.email?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email || "Aluno"}
                </p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
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

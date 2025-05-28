
import React from "react";
import {
  LayoutDashboard,
  Building2,
  Heart,
  Handshake,
  Wrench,
  GraduationCap,
  Settings,
  CreditCard,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StudentSidebar = () => {
  const { user } = useAuth();
  
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

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header da Sidebar */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Portal do Aluno</h2>
      </div>

      {/* Informações do usuário */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="" alt={user?.email || "Aluno"} />
            <AvatarFallback>{user?.email?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.email || "Aluno"}</p>
            <p className="text-xs text-gray-500 truncate">Estudante</p>
          </div>
        </div>
      </div>

      {/* Menu de navegação */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default StudentSidebar;


import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
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
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StudentSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  
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
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="md:hidden absolute top-4 left-4" />
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64 flex flex-col gap-4">
        <SheetHeader className="text-left">
          <SheetTitle>Menu do Aluno</SheetTitle>
          <SheetDescription>
            Navegue pelas principais áreas do seu painel.
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center space-x-2 p-2 rounded-md">
          <Avatar>
            <AvatarImage src="" alt={user?.email || "Aluno"} />
            <AvatarFallback>{user?.email?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user?.email || "Aluno"}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors ${
                  isActive
                    ? "bg-gray-100 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StudentSidebar;

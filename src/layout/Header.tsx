
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";
import { User, Bell, Menu, X } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const isStudent = location.pathname.startsWith("/student");

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-12 bg-white border-b border-gray-200 z-40 px-4">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center">
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="mr-2"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
          <Link
            to={isAdmin ? "/admin" : isStudent ? "/student" : "/"}
            className="font-bold text-lg text-gray-800"
          >
            Portal do Aluno
          </Link>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={18} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="py-2 px-4">
                <p className="text-sm font-medium">Notificações</p>
              </div>
              <DropdownMenuSeparator />
              <div className="py-2 px-4">
                <p className="text-sm text-gray-500">Nenhuma notificação</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-8 w-8 rounded-full"
              >
                <User size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user && (
                <>
                  <div className="py-2 px-4">
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-gray-500">Usuário</p>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link
                  to={isAdmin ? "/admin/settings" : "/student/settings"}
                  className="cursor-pointer"
                >
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={signOut}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;

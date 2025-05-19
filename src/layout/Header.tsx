
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search, User } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Helper to determine area
  const isAdmin = location.pathname.includes("/admin");
  const isStudent = location.pathname.includes("/student");
  const isHome = location.pathname === "/";
  
  // Only show area-specific elements when in that area
  const showAreaSpecific = isAdmin || isStudent;
  
  return (
    <header className="bg-white border-b border-border fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and site title */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-portal-primary">Portal</span>
            <span className="ml-1 text-2xl font-normal text-portal-dark">Edu</span>
          </Link>
        </div>
        
        {/* Middle section - changes based on route */}
        <div className="hidden md:flex items-center flex-1 mx-8 justify-center">
          {isHome && (
            <nav className="flex space-x-6">
              <Link to="/" className="text-portal-dark hover:text-portal-primary transition-colors">
                Home
              </Link>
              <Link to="/student" className="text-portal-dark hover:text-portal-primary transition-colors">
                Área do Aluno
              </Link>
              <Link to="/admin" className="text-portal-dark hover:text-portal-primary transition-colors">
                Área Admin
              </Link>
            </nav>
          )}
          
          {showAreaSpecific && (
            <div className="relative flex items-center w-full max-w-md">
              {isSearchOpen ? (
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="portal-input pl-10"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-0 z-10"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
              {isSearchOpen && (
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              )}
            </div>
          )}
        </div>
        
        {/* Right section - notifications and user menu */}
        <div className="flex items-center space-x-2">
          {showAreaSpecific && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-portal-danger rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-auto">
                    <DropdownMenuItem className="py-2">
                      <div className="flex flex-col">
                        <span className="font-medium">Novo fornecedor adicionado</span>
                        <span className="text-sm text-muted-foreground">Há 5 minutos</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2">
                      <div className="flex flex-col">
                        <span className="font-medium">Nova avaliação recebida</span>
                        <span className="text-sm text-muted-foreground">Há 1 hora</span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-portal-primary">
                    Ver todas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to={isAdmin ? "/admin" : "/student"} className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={isAdmin ? "/admin/settings" : "/student/settings"} className="w-full">
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/" className="w-full">Sair</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          {/* Mobile menu button - only visible on small screens */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

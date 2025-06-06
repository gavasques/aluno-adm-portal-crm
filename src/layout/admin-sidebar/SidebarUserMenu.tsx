import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Users } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SidebarUserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleGoToStudent = () => {
    navigate("/aluno");
  };

  return (
    <motion.div 
      className="p-4 border-t border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-all duration-200 group">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-gray-700">
                <AvatarImage src="" alt={user?.email || "Admin"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold">
                  {user?.email?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">
                {user?.email?.split('@')[0] || "Admin"}
              </p>
              <p className="text-xs text-gray-400">
                Administrador
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-gray-800 border border-gray-700 shadow-lg">
          <DropdownMenuItem onClick={handleGoToStudent} className="cursor-pointer group text-gray-300 hover:text-white hover:bg-gray-700">
            <Users className="mr-3 h-4 w-4 text-green-500 group-hover:text-green-400 transition-colors" />
            <span className="font-medium">Área do Aluno</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 group hover:text-red-300 hover:bg-gray-700">
            <LogOut className="mr-3 h-4 w-4 group-hover:text-red-300 transition-colors" />
            <span className="font-medium">Sair do Sistema</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

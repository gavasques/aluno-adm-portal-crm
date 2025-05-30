
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
    navigate("/aluno/dashboard");
  };

  return (
    <motion.div 
      className="p-4 border-t border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full flex items-center justify-between p-3 rounded-xl glass-button transition-all duration-200 group">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-8 w-8 ring-2 ring-white/20">
                <AvatarImage src="" alt={user?.email || "Admin"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                  {user?.email?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                {user?.email?.split('@')[0] || "Admin"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Administrador
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 glass border-white/20 backdrop-blur-xl">
          <DropdownMenuItem onClick={handleGoToStudent} className="cursor-pointer group">
            <Users className="mr-3 h-4 w-4 text-green-500 group-hover:text-green-600 transition-colors" />
            <span className="font-medium">Área do Aluno</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/20" />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400 group">
            <LogOut className="mr-3 h-4 w-4 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
            <span className="font-medium">Sair do Sistema</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

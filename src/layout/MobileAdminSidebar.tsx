
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { menuGroups } from './admin-sidebar/menuData';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Settings, 
  LogOut, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileAdminSidebarProps {
  onItemClick?: () => void;
}

const MobileAdminSidebar: React.FC<MobileAdminSidebarProps> = ({ onItemClick }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const getUserName = () => {
    return user?.user_metadata?.name || user?.email || "Administrador";
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/admin/dashboard" onClick={onItemClick}>
          <img 
            src="/lovable-uploads/fa166a7e-b1af-4959-a15a-12517ab1ed07.png"
            alt="Logo" 
            className="h-8"
          />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="mb-6"
          >
            <div className="px-6 mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {group.title}
              </h3>
            </div>
            <div className="space-y-1 px-3">
              {group.items.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                    location.pathname === item.href
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Link to="/admin/configuracoes" onClick={onItemClick}>
            <Button variant="ghost" className="w-full justify-start h-auto p-2">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </Link>
          
          <Link to="/aluno" onClick={onItemClick}>
            <Button variant="ghost" className="w-full justify-start h-auto p-2">
              <ExternalLink className="h-4 w-4 mr-2" />
              Área do Aluno
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            onClick={signOut}
            className="w-full justify-start h-auto p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileAdminSidebar;

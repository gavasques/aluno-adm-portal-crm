
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SafeHeader } from '@/components/ui/safe-area';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  title: string;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  showSearch?: boolean;
  notificationCount?: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  onMenuToggle,
  isMenuOpen,
  showSearch = true,
  notificationCount = 0
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <SafeHeader className="bg-white/95 backdrop-blur-lg border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between w-full">
        {/* Menu Button */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="h-10 w-10 p-0"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </Button>
        </motion.div>

        {/* Title or Search */}
        <div className="flex-1 mx-4">
          {isSearchExpanded ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                placeholder="Buscar..."
                className="w-full"
                autoFocus
                onBlur={() => setIsSearchExpanded(false)}
              />
            </motion.div>
          ) : (
            <motion.h1 
              className="text-lg font-semibold text-gray-900 truncate"
              layoutId="header-title"
            >
              {title}
            </motion.h1>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showSearch && !isSearchExpanded && (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchExpanded(true)}
                className="h-10 w-10 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          <motion.div whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 relative">
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-red-500"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </SafeHeader>
  );
};


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import ModernAdminSidebar from './ModernAdminSidebar';
import MobileAdminSidebar from './MobileAdminSidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { ResponsiveLayout } from '@/components/ui/responsive-layout';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  isAdmin: boolean;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ isAdmin, children }) => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  if (isMobile) {
    return (
      <NotificationsProvider>
        <ResponsiveLayout
          className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
          useSafeArea={true}
          mobileFirst={true}
        >
          {/* Mobile Header */}
          <MobileHeader
            title={isAdmin ? "Administração" : "Portal do Aluno"}
            onMenuToggle={handleMenuToggle}
            isMenuOpen={isMobileMenuOpen}
          />

          {/* Mobile Drawer */}
          <MobileDrawer isOpen={isMobileMenuOpen} onClose={handleMenuClose}>
            {isAdmin ? (
              <MobileAdminSidebar onItemClick={handleMenuClose} />
            ) : (
              <div className="p-4">
                <p className="text-gray-600">Sidebar do Aluno Mobile em desenvolvimento</p>
              </div>
            )}
          </MobileDrawer>

          {/* Main Content */}
          <motion.div 
            className="flex-1 p-4 pt-2 pb-8 overflow-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children || <Outlet />}
          </motion.div>
          
          {/* Background Elements otimizado para mobile */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-400/5 rounded-full blur-2xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400/5 rounded-full blur-2xl" />
          </div>
        </ResponsiveLayout>
      </NotificationsProvider>
    );
  }

  // Layout desktop
  return (
    <NotificationsProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full z-40">
          {isAdmin ? <ModernAdminSidebar /> : <StudentSidebar />}
        </div>
        
        {/* Main Content */}
        <div className="ml-64 min-h-screen">
          <motion.main 
            className="p-6 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="max-w-7xl mx-auto">
              {children || <Outlet />}
            </div>
          </motion.main>
        </div>
        
        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl" />
        </div>
      </div>
    </NotificationsProvider>
  );
};

export default Layout;

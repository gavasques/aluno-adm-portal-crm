import React from 'react';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import './Layout.css';
import AdminSidebar from './admin-sidebar/AdminSidebar';
import StudentSidebar from './student-sidebar/StudentSidebar';
import { NotificationsProvider } from '@/contexts/NotificationsContext';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const Layout = ({ children, isAdmin }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className={`layout-container ${isAdmin ? 'admin-layout' : 'student-layout'}`}>
      <NotificationsProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            {isAdmin ? <AdminSidebar /> : <StudentSidebar />}
            
            <div className="flex flex-1 flex-col">
              <TopBar />
              
              <main className="flex-1 p-6 overflow-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </NotificationsProvider>
    </div>
  );
};

export default Layout;

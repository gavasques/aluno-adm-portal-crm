
import React from 'react';
import { motion } from 'framer-motion';
import StudentSidebar from './StudentSidebar';
import AdminSidebar from './AdminSidebar';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar */}
      {isAdmin ? <AdminSidebar /> : <StudentSidebar />}
      
      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        <motion.main 
          className="p-6 lg:p-8 safe-top safe-bottom"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </motion.main>
      </div>
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>
    </div>
  );
};

export default Layout;


import React from 'react';
import AdminSidebar from './AdminSidebar';
import StudentSidebar from './StudentSidebar';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin = false }) => {
  const sidebarWidth = isAdmin ? 220 : 224; // Sidebar mais estreita para admin

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      {isAdmin ? <AdminSidebar /> : <StudentSidebar />}
      
      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Content Area - reduzido padding */}
        <main className="flex-1 p-2 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

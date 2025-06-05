
import React from 'react';
import { useAuth } from '@/hooks/auth';
import AdminSidebar from './AdminSidebar';
import StudentSidebar from './StudentSidebar';
import PendingValidationOverlay from '@/components/layout/PendingValidationOverlay';

interface LayoutProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ isAdmin, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar */}
      {isAdmin ? (
        <div className="flex-shrink-0">
          <AdminSidebar />
        </div>
      ) : (
        <StudentSidebar />
      )}
      
      {/* Main content area */}
      <div className={`flex-1 overflow-auto ${!isAdmin ? 'ml-64' : ''}`}>
        <main className="w-full">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
      
      <PendingValidationOverlay />
    </div>
  );
};

export default Layout;


import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import ModernAdminSidebar from './ModernAdminSidebar';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { SkipToContent } from '@/components/accessibility/SkipToContent';
import { TouchTarget } from '@/components/accessibility/TouchTarget';
import { KeyboardNavigation } from '@/components/accessibility/KeyboardNavigation';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin = false }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Define when to show the modern sidebar vs old sidebar
  const useModernSidebar = isAdmin;
  
  // Calculate margins based on sidebar type
  const adminMarginLeft = useModernSidebar ? 'ml-64' : 'ml-[var(--sidebar-width,220px)]';

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <SkipToContent />
        <KeyboardNavigation />
        
        {isAdmin && user && (
          <>
            {useModernSidebar ? (
              <ModernAdminSidebar />
            ) : (
              <AdminSidebar />
            )}
          </>
        )}
        
        <main 
          className={`flex-1 min-h-screen ${isAdmin && user ? adminMarginLeft : ''}`}
          id="main-content"
        >
          <TouchTarget>
            {children}
          </TouchTarget>
        </main>
      </div>
    </AccessibilityProvider>
  );
};

export default Layout;

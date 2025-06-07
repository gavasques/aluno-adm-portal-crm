
import React from 'react';
import UnifiedOptimizedLayout from './UnifiedOptimizedLayout';

interface LayoutProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

// Wrapper de compatibilidade para manter a API existente
const Layout: React.FC<LayoutProps> = ({ isAdmin, children }) => {
  return (
    <UnifiedOptimizedLayout isAdmin={isAdmin}>
      {children}
    </UnifiedOptimizedLayout>
  );
};

export default Layout;

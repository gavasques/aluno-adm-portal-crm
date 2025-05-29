
import React from 'react';
import OptimizedLayout from './OptimizedLayout';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin = false }) => {
  return (
    <OptimizedLayout isAdmin={isAdmin}>
      <div className="bg-white min-h-full">
        {children}
      </div>
    </OptimizedLayout>
  );
};

export default Layout;

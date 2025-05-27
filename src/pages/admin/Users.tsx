
import React from "react";
import { PerformanceOptimizedUserProvider } from "@/contexts/PerformanceOptimizedUserContext";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { OptimizedUsersPageContent } from "@/components/admin/users/OptimizedUsersPageContent";
import { ComparisonToggle } from "@/components/admin/users/ComparisonToggle";
import ErrorBoundary from "@/components/ErrorBoundary";

const UsersContent = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Usuários' }
  ];

  return (
    <PerformanceOptimizedUserProvider>
      <div className="w-full space-y-6">
        <BreadcrumbNav 
          items={breadcrumbItems} 
          showBackButton={true}
          backHref="/admin"
          className="mb-6"
        />
        
        <ComparisonToggle />
        
        <OptimizedUsersPageContent />
      </div>
    </PerformanceOptimizedUserProvider>
  );
};

const Users = () => {
  return (
    <ErrorBoundary>
      <UsersContent />
    </ErrorBoundary>
  );
};

export default Users;

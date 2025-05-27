
import React from "react";
import { PerformanceOptimizedUserProvider } from "@/contexts/PerformanceOptimizedUserContext";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { PerformanceOptimizedUsersPageContent } from "@/components/admin/users/PerformanceOptimizedUsersPageContent";
import ErrorBoundary from "@/components/ErrorBoundary";

const OptimizedUsersContent = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Usuários (Otimizada)' }
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
        <PerformanceOptimizedUsersPageContent />
      </div>
    </PerformanceOptimizedUserProvider>
  );
};

const OptimizedUsers = () => {
  return (
    <ErrorBoundary>
      <OptimizedUsersContent />
    </ErrorBoundary>
  );
};

export default OptimizedUsers;


import React from "react";
import { PerformanceOptimizedUserProvider } from "@/contexts/PerformanceOptimizedUserContext";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { UnifiedUserPage } from "@/features/users/components/UnifiedUserPage";
import ErrorBoundary from "@/components/ErrorBoundary";

const UnifiedUsersContent = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Usuários (Unificada)' }
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
        <UnifiedUserPage />
      </div>
    </PerformanceOptimizedUserProvider>
  );
};

const UnifiedUsers = () => {
  return (
    <ErrorBoundary>
      <UnifiedUsersContent />
    </ErrorBoundary>
  );
};

export default UnifiedUsers;

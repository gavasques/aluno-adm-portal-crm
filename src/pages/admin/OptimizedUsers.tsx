
import React from "react";
import { OptimizedUserProvider } from "@/contexts/OptimizedUserContext";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { OptimizedUsersPageContent } from "@/components/admin/users/OptimizedUsersPageContent";
import ErrorBoundary from "@/components/ErrorBoundary";

const OptimizedUsersContent = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Usuários (Otimizada)' }
  ];

  return (
    <OptimizedUserProvider>
      <div className="w-full space-y-6">
        <BreadcrumbNav 
          items={breadcrumbItems} 
          showBackButton={true}
          backHref="/admin"
          className="mb-6"
        />
        <OptimizedUsersPageContent />
      </div>
    </OptimizedUserProvider>
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

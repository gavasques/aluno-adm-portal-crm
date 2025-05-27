
import React from "react";
import { UserProvider } from "@/contexts/UserContext";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { UsersPageContent } from "@/components/admin/users/UsersPageContent";
import ErrorBoundary from "@/components/ErrorBoundary";

const UsersContent = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Usuários' }
  ];

  return (
    <UserProvider>
      <div className="w-full space-y-6">
        <BreadcrumbNav 
          items={breadcrumbItems} 
          showBackButton={true}
          backHref="/admin"
          className="mb-6"
        />
        <UsersPageContent />
      </div>
    </UserProvider>
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

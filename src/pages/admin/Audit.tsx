
import React from 'react';
import { AuditDashboard } from '@/components/admin/audit/AuditDashboard';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import ErrorBoundary from '@/components/ErrorBoundary';

const AuditContent: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Auditoria' }
  ];

  return (
    <div className="w-full">
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin"
        className="mb-6"
      />
      
      <AuditDashboard />
    </div>
  );
};

const Audit: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuditContent />
    </ErrorBoundary>
  );
};

export default Audit;
